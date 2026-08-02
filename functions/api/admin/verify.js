/**
 * Admin verification for the /api/admin/* Pages Functions.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  WHAT CHANGED AND WHY
 * ─────────────────────────────────────────────────────────────────────────
 *  The previous implementation decoded the JWT payload and trusted it without
 *  ever checking the signature:
 *
 *      const payload = JSON.parse(atob(parts[1]...))
 *      const email = payload.email || payload.sub || ''
 *      if (!adminEmails.includes(email.toLowerCase())) { ...reject... }
 *      return { ok: true, email, userId }
 *
 *  A JWT payload is just base64 — anyone could mint `{"email":"<an admin>"}`,
 *  base64 it into a three-part string, and receive full admin access. There was
 *  also a development fallback that accepted a bare `email:token` string, with
 *  the same result. The sibling endpoints compounded it by reading the admin's
 *  identity from an `x-admin-user-id` request header.
 *
 *  This now delegates to functions/_shared/admin.js, which:
 *    1. verifies the token's RS256 signature against Clerk's published JWKS
 *    2. checks exp / nbf / iss
 *    3. takes the user ID from the verified claims, never from a header
 *    4. resolves the email through Clerk's Backend API (authoritative)
 *    5. checks it against ADMIN_EMAILS, then Clerk publicMetadata.role, then
 *       the `users.role` column
 *
 *  The exported surface is unchanged, so callers did not need rewriting:
 *
 *      import { verifyAdmin, corsHeaders, handleOptions } from './verify.js';
 *      const admin = await verifyAdmin(request, env);
 *      if (!admin.ok) return admin.response;
 *      // admin.userId and admin.email are now trustworthy
 */

import { requireAdmin, adminEmails } from '../../_shared/admin.js';

/**
 * Verify that the request comes from an authenticated administrator.
 *
 * @returns {Promise<
 *   | { ok: true, userId: string, email: string, via: string }
 *   | { ok: false, response: Response }
 * >}
 */
export async function verifyAdmin(request, env) {
  const result = await requireAdmin(request, env);

  if (!result.ok) {
    // Re-wrap so refusals carry CORS headers like every other response here.
    return { ok: false, response: withCors(result.response) };
  }

  return result;
}

/** Re-exported so endpoints can read the configured list without re-parsing it. */
export { adminEmails };

// CORS headers for admin API
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Handle OPTIONS preflight requests
 */
export function handleOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

/** Copy a response, adding the CORS headers. */
export function withCors(res) {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(corsHeaders)) headers.set(k, v);
  return new Response(res.body, { status: res.status, headers });
}

/** JSON responder that always carries CORS headers. */
export function adminJson(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

/**
 * Admin verify endpoint — used by the client to check admin status.
 * GET /api/admin/verify
 */
export async function onRequestGet(context) {
  const { request, env } = context;

  const admin = await verifyAdmin(request, env);
  if (!admin.ok) return admin.response;

  return adminJson({
    ok: true,
    email: admin.email,
    userId: admin.userId,
    isAdmin: true,
    // Which rule granted access — useful when debugging why someone does or
    // does not have the admin nav.
    via: admin.via,
  });
}

export async function onRequestOptions() {
  return handleOptions();
}
