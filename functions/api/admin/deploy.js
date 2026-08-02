/**
 * Admin Deploy API — Cloudflare Pages Function
 * 
 * Triggers a site rebuild by calling the Vercel deploy hook.
 * Used after publishing blog posts or creating new calculators.
 * 
 * POST /api/admin/deploy
 */

import { verifyAdmin, corsHeaders, handleOptions } from './verify.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  const admin = await verifyAdmin(request, env);
  if (!admin.ok) return admin.response;
  
  const deployHook = env.VERCEL_DEPLOY_HOOK;
  
  if (!deployHook) {
    return new Response(
      JSON.stringify({ 
        error: 'Deploy hook not configured. Set VERCEL_DEPLOY_HOOK in environment variables.' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
  
  try {
    const res = await fetch(deployHook, { method: 'POST' });
    
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Deploy hook returned ${res.status}` }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    const data = await res.json().catch(() => ({}));
    
    return new Response(
      JSON.stringify({ 
        ok: true, 
        message: 'Deploy triggered successfully',
        deployId: data.id || null,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to trigger deploy' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}

export async function onRequestOptions() {
  return handleOptions();
}
