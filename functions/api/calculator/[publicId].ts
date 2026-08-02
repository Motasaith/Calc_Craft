// GET /api/calculator/<publicId> — public, unauthenticated read of one
// user-built calculator.
//
// This is what an embedded widget on a customer's own website calls. It must
// work with no session, so it deliberately returns only what is needed to
// render: the config, the name, and nothing about the owner.
//
// Only calculators flagged `is_public` are served. An owner can unpublish one
// from their dashboard and the embed goes dark immediately, which is the point
// of serving embeds from the database rather than from a base64 blob baked into
// the iframe URL.

import { getSql, releaseSql, json } from '../../_shared/db.js'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function onRequestGet(context: any) {
  const { params, env } = context

  const publicId = String(params.publicId || '').slice(0, 64)
  if (!publicId) {
    return withCors(json({ error: 'Missing calculator id.' }, 400))
  }

  let sql
  try {
    sql = getSql(env)
  } catch {
    return withCors(json({ error: 'The database is not configured on the server.' }, 500))
  }

  try {
    const rows = await sql`
      select public_id, name, description, config, is_public, created_with
      from user_calculators
      where public_id = ${publicId}
      limit 1
    `

    if (rows.length === 0 || !rows[0].is_public) {
      // Same response either way — whether a given id exists is not something
      // an anonymous caller needs to be able to probe for.
      return withCors(json({ error: 'That calculator is not available.' }, 404))
    }

    const row = rows[0]

    // Bump the view counter on the same connection, before it is released. It
    // cannot be deferred to waitUntil: the socket belongs to this request, and
    // touching it after the handler returns is exactly the "I/O on behalf of a
    // different request" error. A failed count is not worth failing the read.
    await sql`update user_calculators set view_count = view_count + 1 where public_id = ${publicId}`
      .catch(() => {})

    return withCors(
      new Response(
        JSON.stringify({
          publicId: row.public_id,
          name: row.name,
          description: row.description,
          config: row.config,
          createdWith: row.created_with,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            // Embeds are hot paths on other people's sites; a short edge cache
            // keeps the database out of the critical path without making edits
            // take long to appear.
            'Cache-Control': 'public, max-age=60, s-maxage=300',
          },
        }
      )
    )
  } catch (err: any) {
    console.error('[api/calculator/:publicId]', err && err.message)
    return withCors(json({ error: 'Could not load that calculator.' }, 500))
  } finally {
    releaseSql(sql, context)
  }
}

function withCors(res: Response) {
  const headers = new Headers(res.headers)
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v)
  return new Response(res.body, { status: res.status, headers })
}
