// GET /api/admin/logs — recent Sentry issues, for the admin dashboard.
//
// Authorisation used to come from an `x-admin-user-id` header plus an
// "does this user exist in Clerk" check, which anyone could satisfy. It now
// goes through verifyAdmin(), which verifies the session token's signature.

import { verifyAdmin, adminJson, handleOptions } from './verify.js';

export async function onRequestOptions() {
  return handleOptions();
}

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();

  const admin = await verifyAdmin(request, env);
  if (!admin.ok) return admin.response;

  const sentryToken = env.SENTRY_AUTH_TOKEN;
  const org = env.SENTRY_ORG || 'bina-codes';
  const project = env.SENTRY_PROJECT || 'homeofcalculators';

  if (!sentryToken) {
    return adminJson(
      {
        error:
          'SENTRY_AUTH_TOKEN is not set. Create an auth token in Sentry (Settings → Auth Tokens, scope: project:read) and add it in the Cloudflare Pages environment variables.',
      },
      500
    );
  }

  try {
    const sentryRes = await fetch(
      `https://sentry.io/api/0/projects/${org}/${project}/issues/?statsPeriod=14d`,
      { headers: { Authorization: `Bearer ${sentryToken}` } }
    );

    if (!sentryRes.ok) {
      const errorText = await sentryRes.text().catch(() => '');
      return adminJson(
        { error: `Sentry returned ${sentryRes.status}.`, details: errorText.slice(0, 500) },
        502
      );
    }

    const data = await sentryRes.json();
    return adminJson(data);
  } catch (err: any) {
    console.error('[admin/logs]', err && err.message);
    return adminJson({ error: 'Could not reach Sentry.' }, 502);
  }
}
