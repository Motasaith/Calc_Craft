import { loadEnvConfig } from '@next/env'
import { neon } from '@neondatabase/serverless'

// Load env files
loadEnvConfig(process.cwd())

const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('DATABASE_URL is not defined in env files')
  process.exit(1)
}

async function run() {
  console.log('Connecting to Neon database...')
  const sql = neon(databaseUrl!)

  console.log('Running ALTER TABLE migrations on "accounts"...')

  try {
    // 1. Add type column as varchar(255)
    // We add it as nullable first, update it, and then set to NOT NULL to support existing data safely.
    await sql`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS type varchar(255);`
    await sql`UPDATE accounts SET type = 'oauth' WHERE type IS NULL;`
    await sql`ALTER TABLE accounts ALTER COLUMN type SET NOT NULL;`
    console.log('✔ Column "type" updated/added successfully.')

    // 2. Add other columns
    await sql`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS expires_at integer;`
    await sql`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS token_type varchar(255);`
    await sql`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS session_state text;`
    console.log('✔ Columns "expires_at", "token_type", "session_state" added/verified.')

    // 3. Drop old columns
    await sql`ALTER TABLE accounts DROP COLUMN IF EXISTS access_token_expires_at;`
    await sql`ALTER TABLE accounts DROP COLUMN IF EXISTS refresh_token_expires_at;`
    console.log('✔ Old columns "access_token_expires_at" and "refresh_token_expires_at" dropped.')

    console.log('🚀 DB migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

run()
