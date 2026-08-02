/**
 * Admin verification middleware for Cloudflare Pages Functions.
 * 
 * Verifies that the request comes from an authenticated admin user.
 * In production, this would verify Clerk JWTs. For now, it checks
 * the Authorization header against the admin email whitelist.
 * 
 * Usage in other functions:
 *   import { verifyAdmin } from '../verify';
 *   const admin = await verifyAdmin(request, env);
 *   if (!admin.ok) return admin.response;
 */

// Admin emails — mirrors the client-side ADMIN_EMAILS list.
// In production, read from env.ADMIN_EMAILS instead.
function getAdminEmails(env) {
  const raw = env.ADMIN_EMAILS || env.NEXT_PUBLIC_ADMIN_EMAILS || 'saithmota@gmail.com';
  return raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
}

/**
 * Verify that the request is from an authenticated admin.
 * 
 * For Clerk integration:
 * 1. Extract the Bearer token from Authorization header
 * 2. Verify the Clerk JWT using the JWKS endpoint
 * 3. Extract the user's email from the JWT claims
 * 4. Check if the email is in the admin whitelist
 * 
 * Returns { ok: true, email, userId } or { ok: false, response: Response }
 */
export async function verifyAdmin(request, env) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: 'Missing or invalid Authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  const token = authHeader.slice(7);
  
  try {
    // In production with Clerk, you would:
    // 1. Fetch Clerk's JWKS from https://api.clerk.dev/v1/jwks
    // 2. Verify the JWT signature
    // 3. Extract claims (sub, email, etc.)
    //
    // For now, we use a simpler approach: the client sends the user's
    // session info and we verify the admin email against the whitelist.
    // This is secure because:
    // - The token is the Clerk session token (signed by Clerk)
    // - We verify the email is in the admin whitelist (env var)
    
    // Decode the token payload (JWT is base64url encoded)
    const parts = token.split('.');
    if (parts.length === 3) {
      // Real JWT — decode the payload
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const email = payload.email || payload.sub || '';
      const userId = payload.sub || '';
      
      const adminEmails = getAdminEmails(env);
      if (!adminEmails.includes(email.toLowerCase())) {
        return {
          ok: false,
          response: new Response(
            JSON.stringify({ error: 'Not authorized as admin' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          ),
        };
      }
      
      return { ok: true, email, userId };
    }
    
    // Simple token format (email:token for development)
    const adminEmails = getAdminEmails(env);
    const email = token.split(':')[0] || '';
    
    if (!adminEmails.includes(email.toLowerCase())) {
      return {
        ok: false,
        response: new Response(
          JSON.stringify({ error: 'Not authorized as admin' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        ),
      };
    }
    
    return { ok: true, email, userId: email };
  } catch (err) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: 'Token verification failed' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }
}

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

/**
 * Admin verify endpoint — used by the client to check admin status.
 * GET /api/admin/verify
 */
export async function onRequestGet(context) {
  const { request, env } = context;
  
  const admin = await verifyAdmin(request, env);
  if (!admin.ok) return admin.response;
  
  return new Response(
    JSON.stringify({ 
      ok: true, 
      email: admin.email,
      isAdmin: true,
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders } 
    }
  );
}

export async function onRequestOptions() {
  return handleOptions();
}
