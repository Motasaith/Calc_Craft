// GET    /api/admin/user/<userId> — everything known about one user.
// PATCH  /api/admin/user/<userId> — { action: 'ban' | 'unban' | 'signOutAll' }
//
// This is the "everything I can see in Clerk, on my own dashboard" endpoint.
// It stitches together three sources:
//
//   Clerk /v1/users/{id}        — identity, verification state, ban/lock status,
//                                 linked social accounts, MFA
//   Clerk /v1/sessions?user_id= — WHERE and HOW they signed in: IP address,
//                                 city/country, browser, device type, and
//                                 whether each session is still active
//   CockroachDB                 — what they have actually built and saved here
//
// The session records are the part that is not obvious: Clerk exposes device and
// network detail under `latest_activity` on each session, which is the only
// place IP address and geo appear in the Backend API.

import { verifyAdmin, adminJson, handleOptions } from '../verify.js'
import { getSql, releaseSql } from '../../../_shared/db.js'

const CLERK_API = 'https://api.clerk.com/v1'

export async function onRequestOptions() {
  return handleOptions()
}

export async function onRequest(context: any) {
  const { request, env, params } = context

  if (request.method === 'OPTIONS') return handleOptions()

  const admin = await verifyAdmin(request, env)
  if (!admin.ok) return admin.response

  const secret = env.CLERK_SECRET_KEY
  if (!secret) return adminJson({ error: 'CLERK_SECRET_KEY is not set on the server.' }, 500)

  const userId = String(params.userId || '')
  if (!userId) return adminJson({ error: 'Missing user id.' }, 400)

  const clerkHeaders = { Authorization: `Bearer ${secret}` }

  // ── Actions ─────────────────────────────────────────────────────────────
  if (request.method === 'PATCH') {
    const body: any = await request.json().catch(() => ({}))
    const action = body.action

    if (userId === admin.userId && action !== 'signOutAll') {
      return adminJson({ error: 'You cannot ban or lock your own account.' }, 400)
    }

    const routes: Record<string, { path: string; method: string }> = {
      ban: { path: `${CLERK_API}/users/${userId}/ban`, method: 'POST' },
      unban: { path: `${CLERK_API}/users/${userId}/unban`, method: 'POST' },
      lock: { path: `${CLERK_API}/users/${userId}/lock`, method: 'POST' },
      unlock: { path: `${CLERK_API}/users/${userId}/unlock`, method: 'POST' },
    }

    if (action === 'signOutAll') {
      // Clerk has no bulk revoke; revoke each active session individually.
      const sessions = await fetchSessions(userId, clerkHeaders)
      const active = sessions.filter((s: any) => s.status === 'active')
      await Promise.all(
        active.map((s: any) =>
          fetch(`${CLERK_API}/sessions/${s.id}/revoke`, { method: 'POST', headers: clerkHeaders }).catch(() => null)
        )
      )
      return adminJson({ success: true, revoked: active.length })
    }

    const route = routes[action]
    if (!route) {
      return adminJson({ error: 'action must be ban, unban, lock, unlock or signOutAll.' }, 400)
    }

    const res = await fetch(route.path, { method: route.method, headers: clerkHeaders })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      return adminJson({ error: `Clerk returned ${res.status}.`, detail: detail.slice(0, 300) }, 502)
    }
    return adminJson({ success: true })
  }

  if (request.method !== 'GET') {
    return adminJson({ error: 'Method not allowed.' }, 405)
  }

  // ── Read ────────────────────────────────────────────────────────────────
  const [userRes, sessions] = await Promise.all([
    fetch(`${CLERK_API}/users/${userId}`, { headers: clerkHeaders }),
    fetchSessions(userId, clerkHeaders),
  ])

  if (!userRes.ok) {
    if (userRes.status === 404) return adminJson({ error: 'No such user.' }, 404)
    return adminJson({ error: `Clerk returned ${userRes.status}.` }, 502)
  }

  const u: any = await userRes.json()

  const emails = (u.email_addresses || []).map((e: any) => ({
    email: e.email_address,
    verified: e.verification?.status === 'verified',
    // How this address was proven — email code, an OAuth provider, etc.
    strategy: e.verification?.strategy || null,
    primary: e.id === u.primary_email_address_id,
  }))

  const profile = {
    id: u.id,
    firstName: u.first_name,
    lastName: u.last_name,
    username: u.username,
    imageUrl: u.image_url,
    emails,
    primaryEmail: emails.find((e: any) => e.primary)?.email || emails[0]?.email || '',
    phones: (u.phone_numbers || []).map((p: any) => ({
      number: p.phone_number,
      verified: p.verification?.status === 'verified',
    })),
    createdAt: u.created_at,
    updatedAt: u.updated_at,
    lastSignInAt: u.last_sign_in_at,
    banned: !!u.banned,
    locked: !!u.locked,
    twoFactorEnabled: !!u.two_factor_enabled,
    passwordEnabled: !!u.password_enabled,
    role: u.public_metadata?.role || null,
    // Which social providers are attached, and the identity behind each.
    socialAccounts: (u.external_accounts || []).map((a: any) => ({
      provider: (a.provider || '').replace(/^oauth_/, ''),
      email: a.email_address,
      username: a.username,
      avatar: a.avatar_url,
      verified: a.verification?.status === 'verified',
    })),
  }

  // The interesting part: where and how each session was created.
  const devices = sessions.map((s: any) => {
    const act = s.latest_activity || {}
    return {
      sessionId: s.id,
      status: s.status, // active | ended | removed | revoked | expired
      createdAt: s.created_at,
      lastActiveAt: s.last_active_at,
      expireAt: s.expire_at,
      ipAddress: act.ip_address || null,
      city: act.city || null,
      country: act.country || null,
      browser: [act.browser_name, act.browser_version].filter(Boolean).join(' ') || null,
      os: act.device_type || null,
      isMobile: !!act.is_mobile,
    }
  })

  // What they have in our own system.
  let dbData: any = { error: 'Could not reach the database.' }
  let sql
  try {
    sql = getSql(env)
    const [row, calcs, saved, embeds] = await Promise.all([
      sql`select role, email, created_at from users where id = ${userId} limit 1`,
      sql`select id, public_id, name, created_with, view_count, is_public, created_at
          from user_calculators where user_id = ${userId} order by created_at desc limit 50`,
      sql`select calculator_slug, created_at from saved_calculators where user_id = ${userId}`,
      sql`select calculator_slug, created_at from embedded_calculators where user_id = ${userId}`,
    ])

    dbData = {
      role: row[0]?.role || 'user',
      recordCreatedAt: row[0]?.created_at || null,
      calculators: calcs.map((c: any) => ({
        id: c.id,
        publicId: c.public_id,
        name: c.name,
        createdWith: c.created_with,
        views: c.view_count,
        isPublic: c.is_public,
        createdAt: c.created_at,
      })),
      savedCount: saved.length,
      savedSlugs: saved.map((s: any) => s.calculator_slug),
      embedCount: embeds.length,
      embedSlugs: embeds.map((e: any) => e.calculator_slug),
      totalViews: calcs.reduce((sum: number, c: any) => sum + (c.view_count || 0), 0),
      error: null,
    }
  } catch (e: any) {
    console.error('[admin/user/:id]', e && e.message)
  } finally {
    releaseSql(sql, context)
  }

  return adminJson({ profile, devices, data: dbData })
}

/** Clerk returns sessions newest-first; we keep a bounded window. */
async function fetchSessions(userId: string, headers: Record<string, string>) {
  try {
    const res = await fetch(`${CLERK_API}/sessions?user_id=${encodeURIComponent(userId)}&limit=20`, {
      headers,
    })
    if (!res.ok) return []
    const body = await res.json()
    return Array.isArray(body) ? body : []
  } catch {
    return []
  }
}
