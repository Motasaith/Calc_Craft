import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/**
 * Drizzle ORM schema for Home of Calculators.
 * Backed by Neon Postgres (serverless driver).
 *
 * Three tables:
 *  - posts              → blog posts (TipTap JSON content)
 *  - users              → user accounts (admin + regular users)
 *  - custom_calculators → community-submitted calculators from the Builder
 *
 * NextAuth v5 also expects its own set of tables (accounts, sessions, etc.)
 * which are defined below and managed by @auth/drizzle-adapter.
 */

/* -------------------------------------------------------------------------- */
/*                              NextAuth tables                               */
/* -------------------------------------------------------------------------- */

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  image: text('avatar_url'),
  /** OAuth provider that created the account (e.g. "google") */
  provider: varchar('provider', { length: 50 }),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  /** Admin can disable a user without deleting them */
  isDisabled: boolean('is_disabled').notNull().default(false),
  /** Marks the user as an admin (set via ADMIN_EMAILS whitelist at login) */
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  lastSignIn: timestamp('last_sign_in', { withTimezone: true }),
})

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider_id', { length: 255 }).notNull(),
  providerAccountId: varchar('account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
  password: text('password'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const sessions = pgTable('sessions', {
  sessionToken: varchar('token', { length: 255 }).notNull().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires_at', { withTimezone: true }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const verificationTokens = pgTable('verification_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expires: timestamp('expires_at', { withTimezone: true }).notNull(),
})

/* -------------------------------------------------------------------------- */
/*                              Application tables                            */
/* -------------------------------------------------------------------------- */

export const postStatusEnum = pgEnum('post_status', ['draft', 'published'])

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  /** TipTap JSON document — rendered to HTML at build time for SSG */
  content: text('content'),
  excerpt: text('excerpt'),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  ogImageUrl: text('og_image_url'),
  category: varchar('category', { length: 100 }).default('General'),
  readTime: varchar('read_time', { length: 50 }),
  status: postStatusEnum('status').notNull().default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const customCalculators = pgTable('custom_calculators', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  /** Same JSON shape the Builder already exports/serializes */
  config: jsonb('config').notNull(),
  isPublic: boolean('is_public').notNull().default(false),
  isApproved: boolean('is_approved').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

/* -------------------------------------------------------------------------- */
/*                                 Relations                                  */
/* -------------------------------------------------------------------------- */

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  calculators: many(customCalculators),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const customCalculatorsRelations = relations(customCalculators, ({ one }) => ({
  user: one(users, { fields: [customCalculators.userId], references: [users.id] }),
}))

/* -------------------------------------------------------------------------- */
/*                              Type exports                                  */
/* -------------------------------------------------------------------------- */

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
export type CustomCalculator = typeof customCalculators.$inferSelect
export type NewCustomCalculator = typeof customCalculators.$inferInsert
export type Account = typeof accounts.$inferSelect
export type Session = typeof sessions.$inferSelect