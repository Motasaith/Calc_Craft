import { db } from '@/lib/db'
import { posts, users, customCalculators } from '@/lib/db/schema'
import { eq, desc, count, sql } from 'drizzle-orm'

/* -------------------------------------------------------------------------- */
/*                                  Posts                                     */
/* -------------------------------------------------------------------------- */

export async function getAllPosts() {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      category: posts.category,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .orderBy(desc(posts.updatedAt))
}

export async function getPostById(id: string) {
  const [row] = await db.select().from(posts).where(eq(posts.id, id))
  return row
}

export async function getPublishedPosts() {
  return db
    .select()
    .from(posts)
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.publishedAt))
}

export async function getPublishedPostSlugs() {
  const rows = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.status, 'published'))
  return rows.map((r) => r.slug)
}

/* -------------------------------------------------------------------------- */
/*                                  Users                                     */
/* -------------------------------------------------------------------------- */

export async function getAllUsers() {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      avatarUrl: users.image,
      provider: users.provider,
      isDisabled: users.isDisabled,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
      lastSignIn: users.lastSignIn,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
}

/* -------------------------------------------------------------------------- */
/*                            Custom calculators                              */
/* -------------------------------------------------------------------------- */

export async function getAllCustomCalculators() {
  return db
    .select({
      id: customCalculators.id,
      title: customCalculators.title,
      slug: customCalculators.slug,
      isPublic: customCalculators.isPublic,
      isApproved: customCalculators.isApproved,
      createdAt: customCalculators.createdAt,
      userEmail: users.email,
    })
    .from(customCalculators)
    .leftJoin(users, eq(customCalculators.userId, users.id))
    .orderBy(desc(customCalculators.createdAt))
}

/* -------------------------------------------------------------------------- */
/*                                Dashboard                                   */
/* -------------------------------------------------------------------------- */

export async function getDashboardStats() {
  const [postCount] = await db.select({ value: count() }).from(posts)
  const [userCount] = await db.select({ value: count() }).from(users)
  const [pendingCount] = await db
    .select({ value: count() })
    .from(customCalculators)
    .where(
      sql`${customCalculators.isPublic} = true AND ${customCalculators.isApproved} = false`,
    )

  return {
    postCount: postCount?.value ?? 0,
    userCount: userCount?.value ?? 0,
    pendingCount: pendingCount?.value ?? 0,
  }
}