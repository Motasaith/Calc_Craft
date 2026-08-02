// Clerk session-token verification for Cloudflare Pages Functions.
//
// ─────────────────────────────────────────────────────────────────────────
//  WHY THIS EXISTS
// ─────────────────────────────────────────────────────────────────────────
//  The previous endpoints trusted a client-supplied header:
//
//      const userId = request.headers.get('x-user-id')          // attacker-controlled
//      await fetch(`https://api.clerk.com/v1/users/${userId}`)  // "does this user exist?"
//
//  Existence is not authentication. Anyone could send any Clerk user ID and
//  read or write that person's data — and the admin endpoints had the same
//  hole with `x-admin-user-id`, which made every admin route public to anyone
//  who knew an admin's ID.
//
//  This module does it properly: the browser sends the Clerk **session token**
//  (a signed JWT) as `Authorization: Bearer <token>`, and we verify the
//  signature against Clerk's published JWKS before believing a single claim.
//  The user ID comes out of the verified payload — never off a header.
//
// ─────────────────────────────────────────────────────────────────────────
//  HOW THE BROWSER GETS THE TOKEN
// ─────────────────────────────────────────────────────────────────────────
//      import { useAuth } from '@clerk/nextjs'
//      const { getToken } = useAuth()
//      const token = await getToken()
//      fetch('/api/user/data', { headers: { Authorization: `Bearer ${token}` } })
//
//  Tokens are short-lived (about 60 seconds) and refreshed by the Clerk SDK, so
//  a leaked one is near-worthless. Always call getToken() per request rather
//  than caching it.

/**
 * Verified JWKS keys, cached for the lifetime of the isolate.
 * Clerk rotates signing keys rarely; re-fetching on every request would add a
 * round-trip to every authenticated call.
 */
let jwksCache = { keys: null, fetchedAt: 0, issuer: '' }

const JWKS_TTL_MS = 60 * 60 * 1000 // 1 hour

/** Small helpers for base64url → bytes, which JWTs use everywhere. */
function base64UrlToBytes(input) {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/')
  const withPad = padded + '='.repeat((4 - (padded.length % 4)) % 4)
  const binary = atob(withPad)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function base64UrlToString(input) {
  return new TextDecoder().decode(base64UrlToBytes(input))
}

/**
 * Derives the Clerk Frontend API origin from the publishable key.
 *
 * Clerk publishable keys are `pk_test_<base64(host)>` / `pk_live_<base64(host)>`,
 * where the decoded host is the instance's Frontend API domain. That domain
 * serves the JWKS, so we do not need a separate env var for it.
 */
function issuerFromPublishableKey(pk) {
  if (typeof pk !== 'string') return ''
  const match = pk.match(/^pk_(test|live)_(.+)$/)
  if (!match) return ''
  try {
    // The encoded host has a trailing '$' sentinel.
    const host = base64UrlToString(match[2]).replace(/\$+$/, '')
    return host ? `https://${host}` : ''
  } catch {
    return ''
  }
}

/**
 * Resolves the issuer for this Clerk instance.
 * CLERK_ISSUER wins if set (useful for satellite/custom domains); otherwise it
 * is derived from the publishable key.
 */
export function getClerkIssuer(env) {
  if (env && env.CLERK_ISSUER) return String(env.CLERK_ISSUER).replace(/\/$/, '')
  const pk =
    (env && (env.CLERK_PUBLISHABLE_KEY || env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)) || ''
  return issuerFromPublishableKey(pk)
}

async function getJwks(issuer) {
  const fresh = jwksCache.keys && jwksCache.issuer === issuer && Date.now() - jwksCache.fetchedAt < JWKS_TTL_MS
  if (fresh) return jwksCache.keys

  const res = await fetch(`${issuer}/.well-known/jwks.json`, { cf: { cacheTtl: 3600 } })
  if (!res.ok) throw new Error(`Could not fetch Clerk JWKS (${res.status})`)

  const body = await res.json()
  if (!body || !Array.isArray(body.keys)) throw new Error('Malformed Clerk JWKS')

  jwksCache = { keys: body.keys, fetchedAt: Date.now(), issuer }
  return body.keys
}

/**
 * Verifies a Clerk session JWT and returns its claims.
 *
 * @returns {Promise<{ ok: true, claims: object } | { ok: false, error: string }>}
 */
export async function verifySessionToken(token, env) {
  if (!token || typeof token !== 'string') {
    return { ok: false, error: 'No session token supplied.' }
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    return { ok: false, error: 'Malformed session token.' }
  }

  const issuer = getClerkIssuer(env)
  if (!issuer) {
    return { ok: false, error: 'Clerk is not configured on the server (no publishable key or CLERK_ISSUER).' }
  }

  let header
  let claims
  try {
    header = JSON.parse(base64UrlToString(parts[0]))
    claims = JSON.parse(base64UrlToString(parts[1]))
  } catch {
    return { ok: false, error: 'Malformed session token.' }
  }

  if (header.alg !== 'RS256') {
    // Refuse anything else outright. Accepting "none" or an HMAC alg here is the
    // classic JWT forgery hole.
    return { ok: false, error: `Unsupported token algorithm: ${header.alg}` }
  }

  let keys
  try {
    keys = await getJwks(issuer)
  } catch (e) {
    return { ok: false, error: String(e.message || 'Could not reach Clerk to verify the session.') }
  }

  const jwk = keys.find((k) => k.kid === header.kid)
  if (!jwk) {
    // Key rotated since we cached: drop the cache and try once more.
    jwksCache = { keys: null, fetchedAt: 0, issuer: '' }
    try {
      keys = await getJwks(issuer)
    } catch {
      return { ok: false, error: 'Unknown token signing key.' }
    }
    if (!keys.find((k) => k.kid === header.kid)) {
      return { ok: false, error: 'Unknown token signing key.' }
    }
  }

  const signingKey = keys.find((k) => k.kid === header.kid)

  let cryptoKey
  try {
    cryptoKey = await crypto.subtle.importKey(
      'jwk',
      { kty: signingKey.kty, n: signingKey.n, e: signingKey.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    )
  } catch {
    return { ok: false, error: 'Could not import the token signing key.' }
  }

  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    base64UrlToBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
  )

  if (!valid) {
    return { ok: false, error: 'Invalid token signature.' }
  }

  // Signature is good — now the claims have to make sense.
  const now = Math.floor(Date.now() / 1000)
  const skew = 30 // tolerate modest clock drift between Clerk and the edge

  if (typeof claims.exp === 'number' && claims.exp + skew < now) {
    return { ok: false, error: 'Session token has expired.' }
  }
  if (typeof claims.nbf === 'number' && claims.nbf - skew > now) {
    return { ok: false, error: 'Session token is not valid yet.' }
  }
  if (claims.iss && String(claims.iss).replace(/\/$/, '') !== issuer) {
    return { ok: false, error: 'Session token was issued for a different Clerk instance.' }
  }
  if (!claims.sub) {
    return { ok: false, error: 'Session token has no subject.' }
  }

  return { ok: true, claims }
}

/** Pulls the bearer token out of the Authorization header. */
export function bearerToken(request) {
  const header = request.headers.get('Authorization') || ''
  const match = header.match(/^Bearer\s+(\S+)$/i)
  return match ? match[1] : ''
}

/**
 * The single entry point every authenticated endpoint should use.
 *
 * Returns the verified Clerk user ID plus whatever profile claims the session
 * token carries. Email is only present if the Clerk JWT template includes it —
 * use fetchClerkUser() when you definitely need it.
 *
 * @returns {Promise<
 *   | { ok: true, userId: string, email: string, claims: object }
 *   | { ok: false, response: Response }
 * >}
 */
export async function requireUser(request, env) {
  const token = bearerToken(request)

  if (!token) {
    return { ok: false, response: jsonError('Sign in to continue.', 401) }
  }

  const verified = await verifySessionToken(token, env)

  if (!verified.ok) {
    return { ok: false, response: jsonError(verified.error, 401) }
  }

  const claims = verified.claims

  return {
    ok: true,
    userId: String(claims.sub),
    // Clerk's default session template carries no email; a custom template may
    // add one under `email` or `primary_email_address`.
    email: String(claims.email || claims.primary_email_address || '').toLowerCase(),
    claims,
  }
}

/**
 * Fetches the full user record from Clerk's Backend API.
 *
 * Only call this when the session claims are not enough (e.g. you need the
 * verified email for admin checks). It costs a round-trip, so endpoints that
 * only need the user ID should skip it.
 */
export async function fetchClerkUser(userId, env) {
  const secret = env && env.CLERK_SECRET_KEY
  if (!secret) return null

  try {
    const res = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(userId)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/** Best primary email for a Clerk user record, lowercased. */
export function primaryEmail(clerkUser) {
  if (!clerkUser) return ''
  const list = clerkUser.email_addresses || []
  const primary =
    list.find((e) => e.id === clerkUser.primary_email_address_id) || list[0] || null
  return String((primary && primary.email_address) || '').toLowerCase()
}

export function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
