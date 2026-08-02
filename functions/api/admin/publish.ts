// POST /api/admin/publish — create or update a calculator / blog post.
//
// Authorisation used to come from an `x-admin-user-id` header, which anyone
// could set. It now goes through verifyAdmin(). See verify.js.

import { getDb } from '../../../db';
import { calculators, blogPosts } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { verifyAdmin, handleOptions } from './verify.js';

export async function onRequestOptions() {
  return handleOptions();
}

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();

  const admin = await verifyAdmin(request, env);
  if (!admin.ok) return admin.response;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const dbUrl = env.DATABASE_URL;
  if (!dbUrl) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), { status: 500 });
  }

  try {
    const payload = await request.json();
    const { type, data } = payload;
    
    if (!data) {
      return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
    }

    const db = getDb(dbUrl);

    if (type === 'calculator') {
      // Upsert calculator
      await db.insert(calculators).values({
        slug: data.slug,
        name: data.name,
        shortName: data.shortName || data.name,
        category: data.category || 'misc',
        description: data.description || '',
        keywords: data.keywords || [],
        mode: data.mode || 'form',
        inputs: data.inputs || [],
        formula: data.formula || '',
        resultLabel: data.resultLabel || 'Result',
        resultUnit: data.resultUnit || '',
        seoTitle: data.seoTitle || data.name,
        seoDescription: data.seoDescription || data.description || '',
        updatedAt: new Date(),
      }).onConflictDoUpdate({
        target: calculators.slug,
        set: {
          name: data.name,
          shortName: data.shortName || data.name,
          category: data.category || 'misc',
          description: data.description || '',
          keywords: data.keywords || [],
          mode: data.mode || 'form',
          inputs: data.inputs || [],
          formula: data.formula || '',
          resultLabel: data.resultLabel || 'Result',
          resultUnit: data.resultUnit || '',
          seoTitle: data.seoTitle || data.name,
          seoDescription: data.seoDescription || data.description || '',
          updatedAt: new Date(),
        }
      });
    } else if (type === 'blog') {
      // Upsert blog post
      await db.insert(blogPosts).values({
        slug: data.slug,
        title: data.title,
        content: data.content,
        status: data.status || 'draft',
        updatedAt: new Date(),
      }).onConflictDoUpdate({
        target: blogPosts.slug,
        set: {
          title: data.title,
          content: data.content,
          status: data.status || 'draft',
          updatedAt: new Date(),
        }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid type' }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Internal server error', details: err.message }), { status: 500 });
  }
}
