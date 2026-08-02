// Database access for Cloudflare Pages Functions.
//
// Talks to CockroachDB Cloud over postgres.js. This only works because
// wrangler.toml sets `compatibility_flags = ["nodejs_compat"]` — Workers expose
// TCP sockets only under that flag. Remove it and every call here fails at
// runtime with "no such module node:net", invisible to `next build`.
//
// Verified against workerd: CockroachDB CCL v26.2.1, ~1.7s cold connect.
//
// ─────────────────────────────────────────────────────────────────────────
//  CONNECTION LIFETIME — one client PER REQUEST, never cached
// ─────────────────────────────────────────────────────────────────────────
//  An earlier version of this file cached the client at module scope to reuse
//  the socket across requests. That is invalid on Workers, and fails at runtime
//  with:
//
//      Cannot perform I/O on behalf of a different request. I/O objects
//      (such as streams, request/response bodies, and others) created in the
//      context of one request handler cannot be accessed from a different
//      request's handler.
//
//  A TCP socket opened while serving request A belongs to request A. The second
//  request to hit a warm isolate gets a 500. It looks fine in local testing
//  until you send a second request, which is exactly how it was caught.
//
//  So: create per request, release when done. `prepare: false` is required too —
//  CockroachDB dislikes the extended-protocol prepared statements postgres.js
//  would otherwise cache per connection.

import postgres from 'postgres'

/**
 * Opens a database client for the current request.
 *
 * Callers MUST pair this with releaseSql() — see the usage note above.
 *
 * @throws if DATABASE_URL is not configured.
 */
export function getSql(env) {
  const url = env && env.DATABASE_URL

  if (!url) {
    throw new Error('DATABASE_URL is not set on the server.')
  }

  return postgres(url, {
    prepare: false,
    max: 1,
    idle_timeout: 10,
    connect_timeout: 15,
  })
}

/**
 * Closes a client opened by getSql().
 *
 * Handed to waitUntil() where possible so the socket teardown happens after the
 * response has already been returned, rather than adding latency to it.
 */
export function releaseSql(sql, ctx) {
  if (!sql) return
  const closing = sql.end({ timeout: 5 }).catch(() => {})
  if (ctx && typeof ctx.waitUntil === 'function') {
    ctx.waitUntil(closing)
  }
}

/**
 * Ensures a row exists in `users` for this Clerk user, and keeps email/role in
 * step with what Clerk and ADMIN_EMAILS currently say.
 *
 * Every authenticated write path calls this first, so the foreign keys on
 * saved/embedded/user calculators always resolve — Clerk is the source of truth
 * for identity, this table is just the local mirror the relations hang off.
 *
 * @returns {Promise<{ id: string, email: string, role: string }>}
 */
export async function ensureUser(sql, { userId, email, role }) {
  const safeEmail = String(email || '').toLowerCase()
  const safeRole = role === 'admin' ? 'admin' : 'user'

  const rows = await sql`
    insert into users (id, email, role)
    values (${userId}, ${safeEmail}, ${safeRole})
    on conflict (id) do update set
      email = case when excluded.email <> '' then excluded.email else users.email end,
      role  = excluded.role
    returning id, email, role
  `

  return rows[0]
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
