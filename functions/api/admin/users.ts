// Admin user management.
//
//   GET    /api/admin/users          → list users (Clerk, merged with DB roles)
//   DELETE /api/admin/users?id=<id>  → delete a user from Clerk and the DB
//   PATCH  /api/admin/users          → { userId, role } set a DB role
//
// Authorisation previously came from an `x-admin-user-id` request header, which
// made every route here public to anyone who knew an admin's Clerk ID. It now
// goes through verifyAdmin(), which checks a real signature. See verify.js.

import { verifyAdmin, adminJson, handleOptions } from './verify.js'
import { getSql, releaseSql } from '../../_shared/db.js'

export async function onRequestOptions() {
  return handleOptions()
}

export async function onRequest(context: any) {
  const { request, env } = context

  if (request.method === 'OPTIONS') return handleOptions()

  const admin = await verifyAdmin(request, env)
  if (!admin.ok) return admin.response

  const clerkSecretKey = env.CLERK_SECRET_KEY
  if (!clerkSecretKey) {
    return adminJson({ error: 'CLERK_SECRET_KEY is not set on the server.' }, 500)
  }

  // ── List ────────────────────────────────────────────────────────────────
  if (request.method === 'GET') {
    const res = await fetch('https://api.clerk.com/v1/users?limit=100&order_by=-created_at', {
      headers: { Authorization: `Bearer ${clerkSecretKey}` },
    })

    if (!res.ok) {
      return adminJson({ error: `Clerk returned ${res.status} listing users.` }, 502)
    }

    const clerkUsers: any[] = await res.json()

    // Merge in whatever roles and usage the database knows about, so the admin
    // table can show more than Clerk alone does.
    let dbRows: any[] = []
    let calcCounts: Record<string, number> = {}
    let sql
    try {
      sql = getSql(env)
      dbRows = await sql`select id, role, created_at from users`
      const counts = await sql`
        select user_id, count(*)::int as n from user_calculators group by user_id
      `
      calcCounts = Object.fromEntries(counts.map((c: any) => [c.user_id, c.n]))
    } catch {
      // The list is still useful without the DB side; degrade rather than fail.
    } finally {
      releaseSql(sql, context)
    }

    const roleById = Object.fromEntries(dbRows.map((r) => [r.id, r.role]))

    const users = (Array.isArray(clerkUsers) ? clerkUsers : []).map((u: any) => {
      const emails = u.email_addresses || []
      const primary = emails.find((e: any) => e.id === u.primary_email_address_id) || emails[0]
      return {
        id: u.id,
        email: (primary && primary.email_address) || '',
        firstName: u.first_name,
        lastName: u.last_name,
        imageUrl: u.image_url,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at,
        clerkRole: u.public_metadata?.role || null,
        dbRole: roleById[u.id] || 'user',
        calculatorCount: calcCounts[u.id] || 0,
      }
    })

    return adminJson({ users, total: users.length })
  }

  // ── Change a role ───────────────────────────────────────────────────────
  if (request.method === 'PATCH') {
    const body: any = await request.json().catch(() => null)
    if (!body || !body.userId || !['admin', 'user'].includes(body.role)) {
      return adminJson({ error: 'Send { userId, role: "admin" | "user" }.' }, 400)
    }

    let sql
    try {
      sql = getSql(env)
      const updated = await sql`
        update users set role = ${body.role} where id = ${body.userId} returning id, role
      `
      if (updated.length === 0) {
        return adminJson({ error: 'That user has no record yet — they must sign in once first.' }, 404)
      }
      return adminJson({ success: true, user: updated[0] })
    } catch (e: any) {
      console.error('[admin/users PATCH]', e && e.message)
      return adminJson({ error: 'Could not update that role.' }, 500)
    } finally {
      releaseSql(sql, context)
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────
  if (request.method === 'DELETE') {
    const targetUserId = new URL(request.url).searchParams.get('id')
    if (!targetUserId) {
      return adminJson({ error: 'Missing user ID.' }, 400)
    }

    // An admin deleting their own account would lock them out mid-session and
    // is almost always a misclick.
    if (targetUserId === admin.userId) {
      return adminJson({ error: 'You cannot delete your own admin account.' }, 400)
    }

    const res = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(targetUserId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${clerkSecretKey}` },
    })

    if (!res.ok) {
      return adminJson({ error: `Clerk returned ${res.status} deleting that user.` }, 502)
    }

    // Cascade locally too — the FKs clear their calculators and bookmarks.
    let sql
    try {
      sql = getSql(env)
      await sql`delete from users where id = ${targetUserId}`
    } catch (e: any) {
      console.error('[admin/users DELETE] local cleanup failed:', e && e.message)
    } finally {
      releaseSql(sql, context)
    }

    return adminJson({ success: true })
  }

  return adminJson({ error: 'Method not allowed.' }, 405)
}
