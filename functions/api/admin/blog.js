/**
 * Admin Blog API — Cloudflare Pages Function
 * 
 * Proxies blog CRUD operations to the WordPress REST API.
 * All requests are verified as admin before processing.
 * 
 * Routes:
 *   GET  /api/admin/blog       — List all posts (including drafts)
 *   POST /api/admin/blog       — Create a new post
 *   PUT  /api/admin/blog/:id   — Update a post
 *   DELETE /api/admin/blog/:id — Delete a post
 */

import { verifyAdmin, corsHeaders, handleOptions } from './verify.js';

const WP_API_URL = 'https://cms.homeofcalculators.com/wp-json/wp/v2';

function getWPHeaders(env) {
  const username = env.WP_USERNAME;
  const password = env.WP_APPLICATION_PASSWORD;
  const headers = { 'Content-Type': 'application/json' };
  
  if (username && password) {
    const token = btoa(`${username}:${password}`);
    headers['Authorization'] = `Basic ${token}`;
  }
  
  return headers;
}

/**
 * GET /api/admin/blog — List all posts
 */
export async function onRequestGet(context) {
  const { request, env } = context;
  
  const admin = await verifyAdmin(request, env);
  if (!admin.ok) return admin.response;
  
  try {
    // Fetch all posts including drafts (status=any requires auth)
    const wpHeaders = getWPHeaders(env);
    const res = await fetch(
      `${WP_API_URL}/posts?per_page=100&status=any&_embed`,
      { headers: wpHeaders }
    );
    
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `WordPress API error: ${res.status}` }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    const posts = await res.json();
    
    // Map to a simpler format
    const mapped = posts.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title?.rendered || '',
      content: p.content?.rendered || '',
      excerpt: p.excerpt?.rendered || '',
      status: p.status,
      date: p.date,
      modified: p.modified,
    }));
    
    return new Response(JSON.stringify(mapped), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch posts' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}

/**
 * POST /api/admin/blog — Create a new post
 */
export async function onRequestPost(context) {
  const { request, env } = context;
  
  const admin = await verifyAdmin(request, env);
  if (!admin.ok) return admin.response;
  
  try {
    const body = await request.json();
    const wpHeaders = getWPHeaders(env);
    
    const res = await fetch(`${WP_API_URL}/posts`, {
      method: 'POST',
      headers: wpHeaders,
      body: JSON.stringify({
        title: body.title || 'Untitled',
        content: body.content || '',
        excerpt: body.excerpt || '',
        slug: body.slug || '',
        status: body.status || 'draft',
      }),
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ error: errData.message || `WordPress error: ${res.status}` }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    const post = await res.json();
    return new Response(JSON.stringify({ 
      ok: true, 
      id: post.id, 
      slug: post.slug,
      status: post.status,
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to create post' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}

export async function onRequestOptions() {
  return handleOptions();
}
