import { loadEnvConfig } from '@next/env'
import { neon } from '@neondatabase/serverless'

loadEnvConfig(process.cwd())
const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL

async function run() {
  const sql = neon(databaseUrl!)
  console.log('Promoting saithmota@gmail.com to Admin...')
  const res = await sql`
    UPDATE users 
    SET is_admin = true 
    WHERE email = 'saithmota@gmail.com';
  `
  console.log('Update result:', res)
}
run()
