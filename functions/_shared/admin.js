// Admin authorisation for Cloudflare Pages Functions.
//
// Who counts as an admin, in priority order:
//   1. Their verified Clerk email is listed in the ADMIN_EMAILS env var.
//   2. Their Clerk publicMetadata.role is "admin".
//   3. Their row in the `users` table has role = 'admin'.
//
// ADMIN_EMAILS is the bootstrap: it is the only one that works before any row
// exists, and it is the one you can change without touching the database. The
// DB role exists so an admin can promote someone from the dashboard without a
// redeploy.
//
// The email is always taken from Clerk's Backend API using the verified user ID
// — never from a request header and never from an unverified claim. That was
// the hole in the previous implementation.

import { requireUser, fetchClerkUser, primaryEmail, jsonError } from './clerk.js'
import { getSql, releaseSql } from './db.js'

/** Parses the comma-separated ADMIN_EMAILS allowlist. */
export function adminEmails(env) {
  const raw = (env && (env.ADMIN_EMAILS || env.NEXT_PUBLIC_ADMIN_EMAILS)) || ''
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Verifies the caller is signed in AND an admin.
 *
 * @returns {Promise<
 *   | { ok: true, userId: string, email: string, via: string }
 *   | { ok: false, response: Response }
 * >}
 */
export async function requireAdmin(request, env) {
  const auth = await requireUser(request, env)
  if (!auth.ok) return auth

  const { userId } = auth

  // The session token may not carry an email, and even when it does we prefer
  // the Backend API — it is authoritative and reflects revocations immediately.
  const clerkUser = await fetchClerkUser(userId, env)
  const email = clerkUser ? primaryEmail(clerkUser) : auth.email

  const allowlist = adminEmails(env)

  if (email && allowlist.includes(email)) {
    return { ok: true, userId, email, via: 'ADMIN_EMAILS' }
  }

  if (clerkUser && clerkUser.public_metadata && clerkUser.public_metadata.role === 'admin') {
    return { ok: true, userId, email, via: 'clerk-metadata' }
  }

  // Last resort: a role granted from the admin dashboard.
  let sql
  try {
    sql = getSql(env)
    const rows = await sql`select role from users where id = ${userId} limit 1`
    if (rows.length > 0 && rows[0].role === 'admin') {
      return { ok: true, userId, email, via: 'db-role' }
    }
  } catch {
    // A database outage must not silently grant or deny admin beyond this
    // check — fall through to the refusal below.
  } finally {
    releaseSql(sql)
  }

  return {
    ok: false,
    response: jsonError('This area is restricted to administrators.', 403),
  }
}

/**
 * Whether a given email should be treated as an admin at signup time.
 * Used when mirroring a Clerk user into the `users` table.
 */
export function roleForEmail(env, email) {
  return adminEmails(env).includes(String(email || '').toLowerCase()) ? 'admin' : 'user'
}
