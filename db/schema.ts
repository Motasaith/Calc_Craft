import { pgTable, text, timestamp, jsonb, primaryKey, boolean, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table — a local mirror of Clerk, which stays the source of truth for
// identity. Rows are created on first authenticated write (see ensureUser in
// functions/_shared/db.js) so the foreign keys below always resolve.
//
// `role` is the DB-granted role only. A user can also be an admin by being
// listed in ADMIN_EMAILS or by Clerk publicMetadata — see
// functions/_shared/admin.js for the full precedence.
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull(),
  role: text('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Calculators table (stores custom calculators created by admin)
export const calculators = pgTable('calculators', {
  slug: text('slug').primaryKey(),
  name: text('name').notNull(),
  shortName: text('short_name').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  keywords: jsonb('keywords').$type<string[]>().notNull(),
  mode: text('mode').notNull(),
  inputs: jsonb('inputs').notNull(),
  formula: text('formula').notNull(),
  resultLabel: text('result_label').notNull(),
  resultUnit: text('result_unit').notNull(),
  seoTitle: text('seo_title').notNull(),
  seoDescription: text('seo_description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Blog posts table
export const blogPosts = pgTable('blog_posts', {
  slug: text('slug').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  status: text('status').notNull(), // 'published' | 'draft'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Calculators a user built themselves — in the visual builder or via /build-ai.
//
// This is the table that was missing: saved_calculators and embedded_calculators
// below store only a slug, so there was nowhere for a CustomCalculatorConfig to
// live and "save to my profile" had to fall back to localStorage.
//
// `config` holds the whole CustomCalculatorConfig JSON (see
// components/calculators/shared/CustomCalculatorRenderer.tsx). `publicId` is the
// short, unguessable handle used in embed URLs — /embed/c/<publicId> — so an
// embed snippet stays short and keeps working when the owner edits the
// calculator, instead of base64-ing the entire config into the URL.
export const userCalculators = pgTable('user_calculators', {
  id: text('id').primaryKey(), // uuid
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  publicId: text('public_id').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').default('').notNull(),
  config: jsonb('config').notNull(),
  createdWith: text('created_with').default('builder').notNull(), // 'ai' | 'builder'
  aiPrompt: text('ai_prompt'),
  // Embeds are served to anonymous visitors on the customer's own site, so an
  // unpublished calculator must be refused by the public endpoint.
  isPublic: boolean('is_public').default(true).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('user_calculators_user_idx').on(t.userId),
]);

// Saved calculators mapping
export const savedCalculators = pgTable('saved_calculators', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  calculatorSlug: text('calculator_slug').notNull(), // could refer to standard or custom calculators
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.calculatorSlug] }),
]);

// Embedded calculators mapping
export const embeddedCalculators = pgTable('embedded_calculators', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  calculatorSlug: text('calculator_slug').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.calculatorSlug] }),
]);

export const usersRelations = relations(users, ({ many }) => ({
  savedCalculators: many(savedCalculators),
  embeddedCalculators: many(embeddedCalculators),
  userCalculators: many(userCalculators),
}));

export const userCalculatorsRelations = relations(userCalculators, ({ one }) => ({
  user: one(users, {
    fields: [userCalculators.userId],
    references: [users.id],
  }),
}));

export const savedCalculatorsRelations = relations(savedCalculators, ({ one }) => ({
  user: one(users, {
    fields: [savedCalculators.userId],
    references: [users.id],
  }),
}));

export const embeddedCalculatorsRelations = relations(embeddedCalculators, ({ one }) => ({
  user: one(users, {
    fields: [embeddedCalculators.userId],
    references: [users.id],
  }),
}));
