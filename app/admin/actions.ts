'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { posts, customCalculators, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/* -------------------------------------------------------------------------- */
/*                              Blog post actions                             */
/* -------------------------------------------------------------------------- */

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function createPost(formData: FormData) {
  const title = (formData.get('title') as string) || 'Untitled'
  const slug =
    (formData.get('slug') as string) || slugify(title) || `post-${Date.now()}`

  const [row] = await db
    .insert(posts)
    .values({
      title,
      slug,
      status: 'draft',
    })
    .returning({ id: posts.id })

  revalidatePath('/admin/blog')
  return row.id
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string) || slugify(title)
  const content = formData.get('content') as string
  const excerpt = (formData.get('excerpt') as string) || null
  const seoTitle = (formData.get('seo_title') as string) || null
  const seoDescription =
    (formData.get('seo_description') as string) || null
  const ogImageUrl = (formData.get('og_image_url') as string) || null
  const category = (formData.get('category') as string) || 'General'
  const readTime = (formData.get('read_time') as string) || null
  const status = (formData.get('status') as string) === 'published'
    ? 'published'
    : 'draft'

  const publishedAt =
    status === 'published'
      ? new Date()
      : null

  await db
    .update(posts)
    .set({
      title,
      slug,
      content,
      excerpt,
      seoTitle,
      seoDescription,
      ogImageUrl,
      category,
      readTime,
      status,
      publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))

  // Trigger a Vercel rebuild so the new/updated static blog page appears.
  if (status === 'published' && process.env.VERCEL_DEPLOY_HOOK) {
    try {
      await fetch(process.env.VERCEL_DEPLOY_HOOK, { method: 'POST' })
    } catch {
      // Non-fatal — the post is saved, the rebuild just didn't fire.
    }
  }

  revalidatePath('/admin/blog')
  revalidatePath(`/blog/${slug}`)
}

export async function deletePost(id: string) {
  await db.delete(posts).where(eq(posts.id, id))
  revalidatePath('/admin/blog')
}

/* -------------------------------------------------------------------------- */
/*                                User actions                                */
/* -------------------------------------------------------------------------- */

export async function toggleUserDisabled(id: string, disabled: boolean) {
  await db
    .update(users)
    .set({ isDisabled: disabled })
    .where(eq(users.id, id))
  revalidatePath('/admin/users')
}

/* -------------------------------------------------------------------------- */
/*                           Calculator moderation                            */
/* -------------------------------------------------------------------------- */

export async function approveCalculator(id: string) {
  await db
    .update(customCalculators)
    .set({ isApproved: true })
    .where(eq(customCalculators.id, id))
  revalidatePath('/admin/calculators')
}

export async function rejectCalculator(id: string) {
  await db
    .update(customCalculators)
    .set({ isApproved: false, isPublic: false })
    .where(eq(customCalculators.id, id))
  revalidatePath('/admin/calculators')
}