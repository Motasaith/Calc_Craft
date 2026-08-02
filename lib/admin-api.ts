/**
 * Client for the /api/admin/* endpoints.
 *
 * REWRITTEN. The previous version sent a placeholder credential:
 *
 *     'Authorization': `Bearer temp-token`,
 *     'x-admin-user-id': userId
 *
 * with a comment acknowledging it was a stand-in. Those endpoints now verify a
 * real Clerk session-token signature, so that pattern returns 401 — and the
 * header was the exact hole that made every admin route public to anyone who
 * knew an admin's Clerk ID.
 *
 * Every function here takes `authedFetch` from useAuth(), which attaches a
 * freshly minted Clerk token per request:
 *
 *     const { authedFetch } = useAuth()
 *     const { users } = await fetchAdminUsers(authedFetch)
 */

export type AuthedFetch = (input: string, init?: RequestInit) => Promise<Response>

/** Turns a failed admin response into a message worth showing a human. */
async function unwrap(res: Response, fallback: string) {
  if (res.ok) return res.json()

  const body = await res.json().catch(() => ({}) as any)

  if (res.status === 401) {
    throw new Error('Your session has expired. Please sign in again.')
  }
  if (res.status === 403) {
    throw new Error(
      body.error || 'Your account is not an administrator. Ask an existing admin to add you.'
    )
  }
  throw new Error(body.error || fallback)
}

/** Confirms the signed-in user is an admin. Returns { ok, email, userId, via }. */
export async function verifyAdmin(authedFetch: AuthedFetch) {
  const res = await authedFetch('/api/admin/verify')
  return unwrap(res, 'Could not verify admin access.')
}

/** Lists Clerk users, merged with DB roles and per-user calculator counts. */
export async function fetchAdminUsers(authedFetch: AuthedFetch) {
  const res = await authedFetch('/api/admin/users')
  return unwrap(res, 'Failed to load users.')
}

/** Promotes or demotes a user via the `users.role` column. */
export async function setUserRole(authedFetch: AuthedFetch, userId: string, role: 'admin' | 'user') {
  const res = await authedFetch('/api/admin/users', {
    method: 'PATCH',
    body: JSON.stringify({ userId, role }),
  })
  return unwrap(res, 'Failed to change that role.')
}

/** Deletes a user from Clerk and cascades their rows in the database. */
export async function deleteAdminUser(authedFetch: AuthedFetch, userId: string) {
  const res = await authedFetch(`/api/admin/users?id=${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  })
  return unwrap(res, 'Failed to delete that user.')
}

/** Recent Sentry issues. Requires SENTRY_AUTH_TOKEN on the server. */
export async function fetchSentryLogs(authedFetch: AuthedFetch) {
  const res = await authedFetch('/api/admin/logs')
  return unwrap(res, 'Failed to load error logs.')
}

/** Site-wide stats: WordPress content counts plus database counts. */
export async function fetchAdminStats(authedFetch: AuthedFetch) {
  const res = await authedFetch('/api/admin/stats')
  return unwrap(res, 'Failed to load stats.')
}

/** Publishes a blog post or calculator into the database. */
export async function publishToDB(
  authedFetch: AuthedFetch,
  type: 'blog' | 'calculator',
  data: any
) {
  const res = await authedFetch('/api/admin/publish', {
    method: 'POST',
    body: JSON.stringify({ type, data }),
  })
  return unwrap(res, 'Failed to publish.')
}
