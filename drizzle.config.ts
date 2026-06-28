import type { Config } from 'drizzle-kit'

/**
 * Drizzle Kit configuration.
 *
 * Generate migrations:  npx drizzle-kit generate
 * Push schema directly: npx drizzle-kit push
 * Run migrations:       npx drizzle-kit migrate
 *
 * DATABASE_URL must be set in your environment.
 */
export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Prefer the UNPOOLED connection for migrations — PgBouncer's pooler
    // mode doesn't support prepared statements, which Drizzle Kit relies on.
    // Falls back to DATABASE_URL if the unpooled var isn't set.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config