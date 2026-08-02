// GET/POST /api/user/data — a signed-in user's saved and embedded calculators.
//
// REPLACES an earlier version that read the user ID from an `x-user-id` request
// header and only checked that such a user existed in Clerk. Existence is not
// authentication: anyone could pass any Clerk user ID and read or write that
// person's data. The user ID now comes exclusively from a cryptographically
// verified session token — see functions/_shared/clerk.js.
//
//   GET  → { saved: string[], embedded: string[] }
//   POST → { type: 'saved'|'embedded', action: 'add'|'remove', slug: string }

import { requireUser, fetchClerkUser, primaryEmail } from '../../_shared/clerk.js'
import { getSql, releaseSql, ensureUser, json } from '../../_shared/db.js'
import { roleForEmail } from '../../_shared/admin.js'

export async function onRequest(context: any) {
  const { request, env } = context

  const auth = await requireUser(request, env)
  if (!auth.ok) return auth.response

  const { userId } = auth

  let sql
  try {
    sql = getSql(env)
  } catch (e: any) {
    return json({ error: 'The database is not configured on the server.' }, 500)
  }

  try {
    if (request.method === 'GET') {
      const [saved, embedded] = await Promise.all([
        sql`select calculator_slug from saved_calculators where user_id = ${userId} order by created_at desc`,
        sql`select calculator_slug from embedded_calculators where user_id = ${userId} order by created_at desc`,
      ])

      return json({
        saved: saved.map((r: any) => r.calculator_slug),
        embedded: embedded.map((r: any) => r.calculator_slug),
      })
    }

    if (request.method === 'POST') {
      const payload: any = await request.json().catch(() => null)
      if (!payload) return json({ error: 'Invalid JSON body.' }, 400)

      const { type, action, slug } = payload

      if (!['saved', 'embedded'].includes(type)) {
        return json({ error: 'type must be "saved" or "embedded".' }, 400)
      }
      if (!['add', 'remove'].includes(action)) {
        return json({ error: 'action must be "add" or "remove".' }, 400)
      }
      if (typeof slug !== 'string' || !slug.trim() || slug.length > 200) {
        return json({ error: 'slug is required.' }, 400)
      }

      const cleanSlug = slug.trim()

      // The foreign keys require a users row. Mirror Clerk on first write; the
      // email comes from Clerk's Backend API, never from the request.
      const clerkUser = await fetchClerkUser(userId, env)
      const email = clerkUser ? primaryEmail(clerkUser) : auth.email
      await ensureUser(sql, { userId, email, role: roleForEmail(env, email) })

      if (type === 'saved') {
        if (action === 'add') {
          await sql`
            insert into saved_calculators (user_id, calculator_slug)
            values (${userId}, ${cleanSlug})
            on conflict (user_id, calculator_slug) do nothing
          `
        } else {
          await sql`
            delete from saved_calculators
            where user_id = ${userId} and calculator_slug = ${cleanSlug}
          `
        }
      } else {
        if (action === 'add') {
          await sql`
            insert into embedded_calculators (user_id, calculator_slug)
            values (${userId}, ${cleanSlug})
            on conflict (user_id, calculator_slug) do nothing
          `
        } else {
          await sql`
            delete from embedded_calculators
            where user_id = ${userId} and calculator_slug = ${cleanSlug}
          `
        }
      }

      return json({ success: true })
    }

    return json({ error: 'Method not allowed.' }, 405)
  } catch (err: any) {
    // Never leak SQL or connection strings to the browser.
    console.error('[api/user/data]', err && err.message)
    return json({ error: 'Something went wrong saving your data. Please try again.' }, 500)
  } finally {
    // The socket belongs to this request and must not outlive it.
    releaseSql(sql, context)
  }
}
