/**
 * Generates public/site-index.json at build time.
 *
 * RESTORED. This file was deleted from the repo but `package.json` still ran it
 * as `prebuild`, so every Cloudflare deploy failed before Next.js even started:
 *
 *     Error [ERR_MODULE_NOT_FOUND]: Cannot find module
 *     '/opt/buildhome/repo/scripts/build-site-index.ts'
 *
 * ── WHO USES THE OUTPUT ─────────────────────────────────────────────────────
 *   components/HeroSearch.tsx  — the homepage search box reads it directly
 *   functions/api/chat.js      — the chat widget is fed it so it only ever
 *                                recommends pages that actually exist
 *
 * Both degrade rather than break if it is missing or stale, which is exactly why
 * a deleted generator went unnoticed: the committed JSON from July kept working
 * while silently omitting every page added since.
 *
 * ── SOURCES ─────────────────────────────────────────────────────────────────
 * Calculators and categories come from the local registry; blog posts come from
 * WordPress, which is the CMS for articles only. A WordPress outage costs the
 * blog entries in the index, not the build.
 *
 * Run manually with:  npx tsx scripts/build-site-index.ts
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { BRAND } from '../lib/brand'
import { calculators, CATEGORY_LABELS, type CalculatorCategory } from '../lib/calculators'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = resolve(__dirname, '../public/site-index.json')
const SITE_BASE = BRAND.url.replace(/\/$/, '')

const WP_API_URL = process.env.WP_API_URL || 'https://cms.homeofcalculators.com/wp-json'

interface PostEntry {
  slug: string
  title: string
  excerpt: string
  date: string
  url: string
}

/** Strips HTML and entities so the index stays plain text for the LLM and search. */
function clean(html: string, maxLength = 200): string {
  const text = String(html || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&#039;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text
}

/**
 * Blog posts from WordPress. Never throws — an unreachable CMS should cost the
 * blog section of the index, not the whole deploy.
 */
async function fetchPosts(): Promise<PostEntry[]> {
  const headers: Record<string, string> = { Accept: 'application/json' }

  // Use the application password if one is configured, so the index still builds
  // if anonymous REST reads are ever locked down again.
  const user = process.env.WP_USERNAME
  const pass = process.env.WP_APPLICATION_PASSWORD
  if (user && pass) {
    headers.Authorization = `Basic ${Buffer.from(`${user}:${pass.replace(/\s+/g, '')}`).toString('base64')}`
  }

  try {
    const res = await fetch(
      `${WP_API_URL.replace(/\/$/, '')}/wp/v2/posts?per_page=100&status=publish&orderby=date&order=desc`,
      { headers }
    )

    if (!res.ok) {
      console.warn(`[site-index] WordPress returned ${res.status}; the index will have no blog posts.`)
      return []
    }

    const posts = await res.json()
    if (!Array.isArray(posts)) return []

    return posts.map((p: any) => ({
      slug: p.slug,
      title: clean(p.title?.rendered, 120),
      excerpt: clean(p.excerpt?.rendered ?? p.content?.rendered),
      date: p.date,
      url: `${SITE_BASE}/blog/${p.slug}`,
    }))
  } catch {
    console.warn('[site-index] Could not reach WordPress; the index will have no blog posts.')
    return []
  }
}

async function main() {
  const posts = await fetchPosts()

  const calculatorsIdx = calculators.map((c) => ({
    slug: c.slug,
    name: c.name,
    shortName: c.shortName,
    category: c.category,
    categoryLabel: CATEGORY_LABELS[c.category],
    description: c.description,
    keywords: c.keywords,
    url: `${SITE_BASE}/calculators/${c.slug}`,
  }))

  const categories = (Object.keys(CATEGORY_LABELS) as CalculatorCategory[]).map((key) => ({
    slug: key,
    label: CATEGORY_LABELS[key],
    count: calculators.filter((c) => c.category === key).length,
    url: `${SITE_BASE}/categories/${key}`,
  }))

  // Keep in step with the app router. Anything omitted here is invisible to the
  // homepage search and the chat assistant.
  const staticPages = [
    { slug: 'home', title: 'Home', url: `${SITE_BASE}/` },
    { slug: 'calculators', title: 'All Calculators', url: `${SITE_BASE}/calculators` },
    { slug: 'categories', title: 'Calculator Categories', url: `${SITE_BASE}/categories` },
    { slug: 'build-ai', title: 'AI Calculator Builder', url: `${SITE_BASE}/build-ai` },
    { slug: 'builder', title: 'Visual Calculator Builder', url: `${SITE_BASE}/builder` },
    { slug: 'solver', title: 'AI Math Solver', url: `${SITE_BASE}/solver` },
    { slug: 'casio', title: 'Classic Calculator', url: `${SITE_BASE}/calculators/casio` },
    { slug: 'blog', title: 'Blog', url: `${SITE_BASE}/blog` },
    { slug: 'dashboard', title: 'My Dashboard', url: `${SITE_BASE}/dashboard` },
    { slug: 'about', title: 'About Us', url: `${SITE_BASE}/about` },
    { slug: 'contact', title: 'Contact', url: `${SITE_BASE}/contact` },
    { slug: 'privacy-policy', title: 'Privacy Policy', url: `${SITE_BASE}/privacy-policy` },
    { slug: 'terms-of-use', title: 'Terms of Use', url: `${SITE_BASE}/terms-of-use` },
    { slug: 'cookies', title: 'Cookie Policy', url: `${SITE_BASE}/cookies` },
  ]

  const index = {
    generatedAt: new Date().toISOString(),
    site: {
      name: BRAND.name,
      url: SITE_BASE,
      tagline: BRAND.tagline,
      description: BRAND.description,
      contactEmail: 'support@homeofcalculators.com',
    },
    categories,
    calculators: calculatorsIdx,
    posts,
    staticPages,
  }

  mkdirSync(dirname(OUT_PATH), { recursive: true })
  writeFileSync(OUT_PATH, JSON.stringify(index, null, 2), 'utf8')

  console.log(
    `[site-index] Wrote ${calculatorsIdx.length} calculators, ${categories.length} categories, ` +
      `${posts.length} posts, ${staticPages.length} pages → public/site-index.json`
  )
}

main().catch((err) => {
  // A failure here must not take the deploy down — the previous index stays in
  // place and the site keeps working with slightly stale search data.
  console.error('[site-index] Generation failed:', err?.message || err)
  process.exit(0)
})
