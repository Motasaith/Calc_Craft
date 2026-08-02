// CRUD for calculators a user built themselves — in the visual builder or via
// the AI Calculator Builder at /build-ai.
//
// This is what replaces localStorage. Previously a user's custom calculators
// lived in `localStorage` (and, before that, a shared WordPress user-meta blob),
// so they vanished on a different device and could not be embedded reliably.
// They now live in `user_calculators`, keyed to the verified Clerk user.
//
//   GET                → { calculators: [...] }   the caller's own, newest first
//   POST   { config }  → { calculator }           create, or update when id is supplied
//   DELETE ?id=<uuid>  → { success: true }
//
// The embed URL returned here is short and stable: /embed/c/<publicId>. Editing
// the calculator updates what that URL serves, so a customer's website picks up
// the change without them re-pasting the snippet.

import { requireUser, fetchClerkUser, primaryEmail } from '../../_shared/clerk.js'
import { getSql, releaseSql, ensureUser, json } from '../../_shared/db.js'
import { roleForEmail } from '../../_shared/admin.js'

/** Hard ceiling on a stored config. A legitimate one is a few KB; a logo data-URI can bloat it. */
const MAX_CONFIG_BYTES = 256 * 1024

/** Per-user cap, so one account cannot fill the table. */
const MAX_CALCULATORS_PER_USER = 200

/** Short, unguessable, URL-safe handle for embed links. */
function makePublicId() {
  const bytes = new Uint8Array(9)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(36).padStart(2, '0'))
    .join('')
    .slice(0, 12)
}

function rowToCalculator(row: any) {
  return {
    id: row.id,
    publicId: row.public_id,
    name: row.name,
    description: row.description,
    config: row.config,
    createdWith: row.created_with,
    aiPrompt: row.ai_prompt,
    isPublic: row.is_public,
    viewCount: row.view_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function onRequest(context: any) {
  const { request, env } = context

  const auth = await requireUser(request, env)
  if (!auth.ok) return auth.response

  const { userId } = auth

  let sql
  try {
    sql = getSql(env)
  } catch {
    return json({ error: 'The database is not configured on the server.' }, 500)
  }

  try {
    // ── List ──────────────────────────────────────────────────────────────
    if (request.method === 'GET') {
      const rows = await sql`
        select * from user_calculators
        where user_id = ${userId}
        order by updated_at desc
      `
      return json({ calculators: rows.map(rowToCalculator) })
    }

    // ── Create / update ───────────────────────────────────────────────────
    if (request.method === 'POST') {
      const payload: any = await request.json().catch(() => null)
      if (!payload || typeof payload !== 'object') {
        return json({ error: 'Invalid JSON body.' }, 400)
      }

      const config = payload.config
      if (!config || typeof config !== 'object') {
        return json({ error: 'A calculator config is required.' }, 400)
      }

      const serialized = JSON.stringify(config)
      if (serialized.length > MAX_CONFIG_BYTES) {
        return json(
          { error: 'That calculator is too large to save. Try removing an uploaded logo.' },
          413
        )
      }

      const name = String(config.name || payload.name || 'Untitled calculator').slice(0, 120)
      const description = String(config.description || '').slice(0, 500)
      const createdWith = config.createdWith === 'ai' ? 'ai' : 'builder'
      const aiPrompt = payload.aiPrompt ? String(payload.aiPrompt).slice(0, 2000) : null
      const isPublic = payload.isPublic === false ? false : true

      const clerkUser = await fetchClerkUser(userId, env)
      const email = clerkUser ? primaryEmail(clerkUser) : auth.email
      await ensureUser(sql, { userId, email, role: roleForEmail(env, email) })

      const existingId = typeof payload.id === 'string' && payload.id ? payload.id : null

      if (existingId) {
        // The `user_id` predicate is what stops one user updating another's
        // calculator by guessing an id.
        const updated = await sql`
          update user_calculators set
            name = ${name},
            description = ${description},
            config = ${sql.json(config)},
            created_with = ${createdWith},
            ai_prompt = ${aiPrompt},
            is_public = ${isPublic},
            updated_at = now()
          where id = ${existingId} and user_id = ${userId}
          returning *
        `

        if (updated.length > 0) {
          return json({ calculator: rowToCalculator(updated[0]) })
        }
        // Fall through to insert: the id was for a calculator that no longer
        // exists (or was never ours), so treat this as a fresh save rather than
        // silently losing the user's work.
      }

      const countRows = await sql`
        select count(*)::int as n from user_calculators where user_id = ${userId}
      `
      if (countRows[0].n >= MAX_CALCULATORS_PER_USER) {
        return json(
          { error: `You've reached the limit of ${MAX_CALCULATORS_PER_USER} saved calculators. Delete one to make room.` },
          409
        )
      }

      const inserted = await sql`
        insert into user_calculators
          (id, user_id, public_id, name, description, config, created_with, ai_prompt, is_public)
        values (
          ${crypto.randomUUID()},
          ${userId},
          ${makePublicId()},
          ${name},
          ${description},
          ${sql.json(config)},
          ${createdWith},
          ${aiPrompt},
          ${isPublic}
        )
        returning *
      `

      return json({ calculator: rowToCalculator(inserted[0]) }, 201)
    }

    // ── Delete ────────────────────────────────────────────────────────────
    if (request.method === 'DELETE') {
      const id = new URL(request.url).searchParams.get('id')
      if (!id) return json({ error: 'Missing calculator id.' }, 400)

      const deleted = await sql`
        delete from user_calculators
        where id = ${id} and user_id = ${userId}
        returning id
      `

      if (deleted.length === 0) {
        return json({ error: 'That calculator does not exist, or is not yours.' }, 404)
      }

      return json({ success: true })
    }

    return json({ error: 'Method not allowed.' }, 405)
  } catch (err: any) {
    console.error('[api/user/calculators]', err && err.message)
    return json({ error: 'Something went wrong saving your calculator. Please try again.' }, 500)
  } finally {
    // The socket belongs to this request and must not outlive it.
    releaseSql(sql, context)
  }
}
