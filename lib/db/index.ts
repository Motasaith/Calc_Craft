import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/**
 * Neon Postgres connection (serverless driver).
 *
 * Uses HTTP fetch under the hood — perfect for Vercel edge / serverless
 * functions. No persistent connection pool needed.
 *
 * DATABASE_URL must be set in the environment (Vercel → Neon integration
 * injects this automatically).
 */
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Add the Neon integration in the Vercel dashboard ' +
      'or set DATABASE_URL in your .env.local file.',
  )
}

const sql = neon(connectionString)

/**
 * Drizzle instance — use this for all queries.
 * Import { db } from '@/lib/db'
 */
export const db = drizzle(sql, { schema })

export { schema }