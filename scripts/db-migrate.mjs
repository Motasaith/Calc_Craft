// Idempotent schema migration for CockroachDB.
//
// `drizzle-kit push` hangs on CockroachDB's information_schema introspection,
// so schema changes are applied as plain DDL here instead. Everything uses
// IF NOT EXISTS, so re-running is safe and it doubles as the setup script for a
// fresh database.
//
//   node scripts/db-migrate.mjs
//
// Keep this in step with db/schema.ts — Drizzle still provides the typed query
// layer, it just is not the thing that creates the tables.

import postgres from 'postgres'
import { readFileSync } from 'node:fs'

function loadEnv() {
  try {
    const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
    }
  } catch {
    // fall back to the ambient environment
  }
}

loadEnv()

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set (looked in .env.local and the environment).')
  process.exit(1)
}

const sql = postgres(url, { prepare: false, max: 1, connect_timeout: 20 })

const statements = [
  [
    'users',
    `create table if not exists users (
       id          text primary key,
       email       text not null,
       role        text not null default 'user',
       created_at  timestamp not null default now()
     )`,
  ],
  [
    'user_calculators',
    `create table if not exists user_calculators (
       id            text primary key,
       user_id       text not null references users(id) on delete cascade,
       public_id     text not null unique,
       name          text not null,
       description   text not null default '',
       config        jsonb not null,
       created_with  text not null default 'builder',
       ai_prompt     text,
       is_public     boolean not null default true,
       view_count    int not null default 0,
       created_at    timestamp not null default now(),
       updated_at    timestamp not null default now()
     )`,
  ],
  [
    'user_calculators_user_idx',
    `create index if not exists user_calculators_user_idx on user_calculators (user_id)`,
  ],
  [
    'saved_calculators',
    `create table if not exists saved_calculators (
       user_id          text not null references users(id) on delete cascade,
       calculator_slug  text not null,
       created_at       timestamp not null default now(),
       primary key (user_id, calculator_slug)
     )`,
  ],
  [
    'embedded_calculators',
    `create table if not exists embedded_calculators (
       user_id          text not null references users(id) on delete cascade,
       calculator_slug  text not null,
       created_at       timestamp not null default now(),
       primary key (user_id, calculator_slug)
     )`,
  ],
  [
    'blog_posts',
    `create table if not exists blog_posts (
       slug        text primary key,
       title       text not null,
       content     text not null,
       status      text not null default 'draft',
       created_at  timestamp not null default now(),
       updated_at  timestamp not null default now()
     )`,
  ],
  [
    'calculators',
    `create table if not exists calculators (
       slug              text primary key,
       name              text not null,
       short_name        text not null,
       category          text not null,
       description       text not null,
       keywords          jsonb not null,
       mode              text not null,
       inputs            jsonb not null,
       formula           text not null,
       result_label      text not null,
       result_unit       text not null,
       seo_title         text not null,
       seo_description   text not null,
       created_at        timestamp not null default now(),
       updated_at        timestamp not null default now()
     )`,
  ],
]

// Columns added to tables that may already exist from an earlier shape.
const columnAdds = [
  ['blog_posts.excerpt', `alter table blog_posts add column if not exists excerpt text not null default ''`],
  ['blog_posts.author', `alter table blog_posts add column if not exists author text not null default ''`],
  ['blog_posts.cover_image', `alter table blog_posts add column if not exists cover_image text`],
  ['blog_posts.published_at', `alter table blog_posts add column if not exists published_at timestamp`],
]

try {
  for (const [label, ddl] of statements) {
    await sql.unsafe(ddl)
    console.log(`  ok  ${label}`)
  }
  for (const [label, ddl] of columnAdds) {
    await sql.unsafe(ddl)
    console.log(`  ok  ${label}`)
  }

  const tables = await sql`
    select table_name from information_schema.tables
    where table_schema = 'public' order by table_name
  `
  console.log('\ntables now present:', tables.map((t) => t.table_name).join(', '))
} catch (e) {
  console.error('\nMIGRATION FAILED:', e.message)
  process.exitCode = 1
} finally {
  await sql.end({ timeout: 5 })
}
