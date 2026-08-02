import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Create a singleton connection string. In Cloudflare Pages, we might need
// to read this from the environment variable inside the request handler.
// But we can expose a helper to get the db instance.

export function getDb(connectionString: string) {
  // Disable prefetch as it is not supported in some serverless environments
  const client = postgres(connectionString, { prepare: false })
  return drizzle(client, { schema })
}

// For local/node use (e.g. drizzle-kit)
const globalConnectionString = process.env.DATABASE_URL || ''
const globalClient = globalConnectionString ? postgres(globalConnectionString, { prepare: false }) : null
export const db = globalClient ? drizzle(globalClient, { schema }) : null
