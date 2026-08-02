// GET /api/admin/stats — real site numbers for the admin dashboard.
//
// The dashboard previously counted things out of localStorage, which meant the
// figures were whatever that particular browser had typed into it: a fresh
// browser showed "Blog Posts: 0" regardless of what was actually published, and
// nothing reflected other admins' work or real user activity.
//
// This pulls the true numbers from the two systems that hold them:
//
//   WordPress (cms.homeofcalculators.com) — blog posts and CMS calculators.
//     Counts come from the X-WP-Total response header, so we ask for one item
//     rather than downloading the collection.
//
//   CockroachDB — registered users, user-built calculators, bookmarks, embeds.
//
// Each source is fetched independently and failures are reported per-source, so
// WordPress being down degrades that row to `null` instead of blanking the whole
// dashboard.

import { verifyAdmin, adminJson, handleOptions } from './verify.js'
import { getSql, releaseSql } from '../../_shared/db.js'

const WP_API_BASE = 'https://cms.homeofcalculators.com/wp-json'

export async function onRequestOptions() {
  return handleOptions()
}

export async function onRequest(context: any) {
  const { request, env } = context

  if (request.method === 'OPTIONS') return handleOptions()
  if (request.method !== 'GET') return adminJson({ error: 'Method not allowed.' }, 405)

  const admin = await verifyAdmin(request, env)
  if (!admin.ok) return admin.response

  const base = (env && env.WP_API_URL) || WP_API_BASE

  const [wordpress, database] = await Promise.all([
    collectWordPress(base),
    collectDatabase(env, context),
  ])

  return adminJson({
    wordpress,
    database,
    generatedAt: new Date().toISOString(),
  })
}

/**
 * Reads collection totals from WordPress without downloading the collections.
 * `per_page=1` plus the X-WP-Total header is the cheap way to do this.
 */
async function collectWordPress(base: string) {
  const endpoints: Record<string, string> = {
    posts: `${base}/wp/v2/posts?per_page=1&status=publish`,
    drafts: `${base}/wp/v2/posts?per_page=1&status=draft`,
    calculators: `${base}/wp/v2/calculator?per_page=1`,
    categories: `${base}/wp/v2/categories?per_page=1`,
  }

  const result: Record<string, number | null> = {}
  let error: string | null = null

  await Promise.all(
    Object.entries(endpoints).map(async ([key, url]) => {
      try {
        const res = await fetch(url, { cf: { cacheTtl: 120 } } as any)
        if (!res.ok) {
          result[key] = null
          // 401 here almost always means the determine_current_user filter in
          // the WordPress theme is refusing anonymous reads — the same thing
          // that empties the blog at build time.
          if (!error) error = `WordPress returned ${res.status}${res.status === 401 ? ' (anonymous REST reads are blocked)' : ''}.`
          return
        }
        const total = res.headers.get('x-wp-total')
        result[key] = total === null ? null : parseInt(total, 10)
      } catch {
        result[key] = null
        if (!error) error = 'Could not reach WordPress.'
      }
    })
  )

  return { ...result, error }
}

/** Counts the tables this app owns. */
async function collectDatabase(env: any, context: any) {
  let sql
  try {
    sql = getSql(env)

    const [users, calcs, saved, embeds, aiCalcs, recent] = await Promise.all([
      sql`select count(*)::int as n from users`,
      sql`select count(*)::int as n from user_calculators`,
      sql`select count(*)::int as n from saved_calculators`,
      sql`select count(*)::int as n from embedded_calculators`,
      sql`select count(*)::int as n from user_calculators where created_with = 'ai'`,
      sql`select count(*)::int as n from users where created_at > now() - interval '7 days'`,
    ])

    // Most-viewed user-built calculators — the closest thing to real usage data
    // the site currently records.
    const top = await sql`
      select name, public_id, view_count
      from user_calculators
      where view_count > 0
      order by view_count desc
      limit 5
    `

    return {
      users: users[0].n,
      newUsersThisWeek: recent[0].n,
      userCalculators: calcs[0].n,
      aiBuiltCalculators: aiCalcs[0].n,
      savedBookmarks: saved[0].n,
      embedsTaken: embeds[0].n,
      topCalculators: top.map((r: any) => ({
        name: r.name,
        publicId: r.public_id,
        views: r.view_count,
      })),
      error: null,
    }
  } catch (e: any) {
    console.error('[admin/stats]', e && e.message)
    return { error: 'Could not reach the database.' }
  } finally {
    releaseSql(sql, context)
  }
}
