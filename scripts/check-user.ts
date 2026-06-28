import { loadEnvConfig } from '@next/env'
import { neon } from '@neondatabase/serverless'

loadEnvConfig(process.cwd())
const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL

async function run() {
  const sql = neon(databaseUrl!)
  const res = await sql`SELECT * FROM users;`
  console.log('Users in DB:', res)
  const acc = await sql`SELECT * FROM accounts;`
  console.log('Accounts in DB:', acc)
}
run()
