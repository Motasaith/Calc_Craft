'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { customCalculators } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Save a calculator config to the authenticated user's library.
 * Called from the Builder's "Save to my library" button.
 */
export async function saveCalculatorToLibrary(
  title: string,
  config: any,
) {
  const session = await auth()
  if (!session?.user?.email) {
    return { error: 'You must be signed in to save.' }
  }

  const slug = `${slugify(title) || 'calculator'}-${Date.now().toString(36)}`

  await db.insert(customCalculators).values({
    userId: session.user.id,
    title,
    slug,
    config,
    isPublic: false,
    isApproved: false,
  })

  revalidatePath('/library')
  return { success: true, slug }
}

export async function toggleCalculatorPublic(id: string, isPublic: boolean) {
  const session = await auth()
  if (!session?.user) return { error: 'Not authenticated' }

  await db
    .update(customCalculators)
    .set({ isPublic, updatedAt: new Date() })
    .where(
      and(
        eq(customCalculators.id, id),
        // @ts-expect-error — session.user.id is available with DB strategy
        eq(customCalculators.userId, session.user.id),
      ),
    )

  revalidatePath('/library')
  return { success: true }
}

export async function deleteCalculatorFromLibrary(id: string) {
  const session = await auth()
  if (!session?.user) return { error: 'Not authenticated' }

  await db
    .delete(customCalculators)
    .where(
      and(
        eq(customCalculators.id, id),
        // @ts-expect-error — session.user.id is available with DB strategy
        eq(customCalculators.userId, session.user.id),
      ),
    )

  revalidatePath('/library')
  return { success: true }
}