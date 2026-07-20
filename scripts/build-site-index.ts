/**
 * build-site-index.ts
 * --------------------
 * Build-time data aggregator for the chatbot / search widget.
 *
 * Why this exists: the site is statically exported (output: 'export') and
 * hosted on Cloudflare Pages, so there is no Next.js server to query at
 * request time. Instead we run this script at prebuild time, aggregate
 * every calculator + every WordPress blog post into a single small JSON
 * file (`public/site-index.json`), and the chat widget fetches it on load.
 *
 * After every deploy the file is regenerated, so the chatbot ALWAYS knows
 * about new calculators, new blog posts, and deletions — automatically.
 *
 * Output shape (public/site-index.json):
 * {
 *   "generatedAt": "2026-07-20T...",
 *   "site": { name, url, tagline, ... },
 *   "categories": [{ slug, label, count }],
 *   "calculators": [{ slug, name, category, description, keywords, url }],
 *   "posts": [{ slug, title, excerpt, date, url }],
 *   "staticPages": [{ slug, title, url }]
 * }
 *
 * Run via `npm run build` (prebuild hook) or directly with `tsx`.
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { BRAND } from '../lib/brand'
import {
  calculators,
  CATEGORY_LABELS,
  type CalculatorCategory,
} from '../lib/calculators'

const WP_API_URL = 'https://cms.homeofcalculators.com/wp-json/wp/v2'

const SITE_BASE = BRAND.url.replace(/\/$/, '')

interface IndexCalculator {
  slug: string
  name: string
  category: string
  categoryLabel: string
  description: string
  keywords: string[]
  url: string
}

interface IndexPost {
  slug: string
  title: string
  excerpt: string
  date: string
  url: string
}

interface IndexCategory {
  slug: string
  label: string
  count: number
}

interface SiteIndex {
  generatedAt: string
  site: {
    name: string
    url: string
    tagline: string
    description: string
    contactEmail: string
  }
  categories: IndexCategory[]
  calculators: IndexCalculator[]
  posts: IndexPost[]
  staticPages: { slug: string; title: string; url: string }[]
}

async function fetchPosts(): Promise<IndexPost[]> {
  // Best-effort: if WP is unreachable at build time, we just emit an empty
  // posts list. The chatbot will gracefully note that no posts are indexed.
  try {
    const all: any[] = []
    let page = 1
    let totalPages = 1
    while (page <= totalPages) {
      const res = await fetch(
        `${WP_API_URL}/posts?_embed&per_page=100&page=${page}`,
        { next: { revalidate: 0 } as any }
      )
      if (!res.ok) break
      const data = await res.json()
      all.push(...data)
      const tp = res.headers.get('x-wp-totalpages')
      if (!tp) break
      totalPages = parseInt(tp, 10)
      page++
    }
    return all.map((p) => ({
      slug: p.slug,
      title: (p.title?.rendered ?? '').replace(/<[^>]*>?/gm, '').trim(),
      excerpt: (p.excerpt?.rendered ?? '').replace(/<[^>]*>?/gm, '').trim().slice(0, 300),
      date: p.date ?? '',
      url: `${SITE_BASE}/blog/${p.slug}`,
    }))
  } catch (err) {
    console.warn('[build-site-index] WP posts fetch failed, skipping posts:', (err as Error).message)
    return []
  }
}

async function main() {
  console.log('[build-site-index] aggregating site data for chatbot + search...')

  // ── Categories with counts ───────────────────────────────────────────
  const categoryCounts = new Map<CalculatorCategory, number>()
  for (const c of calculators) {
    categoryCounts.set(c.category, (categoryCounts.get(c.category) ?? 0) + 1)
  }
  const categories: IndexCategory[] = Object.keys(CATEGORY_LABELS).map((k) => {
    const cat = k as CalculatorCategory
    return {
      slug: cat,
      label: CATEGORY_LABELS[cat],
      count: categoryCounts.get(cat) ?? 0,
    }
  })

  // ── Calculators (full list) ──────────────────────────────────────────
  const calculatorsIdx: IndexCalculator[] = calculators.map((c) => ({
    slug: c.slug,
    name: c.name,
    category: c.category,
    categoryLabel: CATEGORY_LABELS[c.category],
    description: c.description,
    keywords: c.keywords,
    url: `${SITE_BASE}/calculators/${c.slug}`,
  }))

  // ── Blog posts ───────────────────────────────────────────────────────
  const posts = await fetchPosts()

  // ── Static pages ──────────────────────────────────────────────────────
  const staticPages = [
    { slug: 'home', title: 'Home', url: `${SITE_BASE}/` },
    { slug: 'calculators', title: 'All Calculators', url: `${SITE_BASE}/calculators` },
    { slug: 'builder', title: 'Visual Calculator Builder', url: `${SITE_BASE}/builder` },
    { slug: 'blog', title: 'Blog', url: `${SITE_BASE}/blog` },
    { slug: 'about', title: 'About Us', url: `${SITE_BASE}/about` },
    { slug: 'contact', title: 'Contact', url: `${SITE_BASE}/contact` },
    { slug: 'solver', title: 'AI Math Solver', url: `${SITE_BASE}/solver` },
    { slug: 'categories', title: 'Calculator Categories', url: `${SITE_BASE}/categories` },
    { slug: 'library', title: 'My Calculator Library', url: `${SITE_BASE}/library` },
    { slug: 'dashboard', title: 'User Dashboard', url: `${SITE_BASE}/dashboard` },
    { slug: 'privacy-policy', title: 'Privacy Policy', url: `${SITE_BASE}/privacy-policy` },
    { slug: 'terms-of-use', title: 'Terms of Use', url: `${SITE_BASE}/terms-of-use` },
  ]

  const index: SiteIndex = {
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

  const outPath = resolve(process.cwd(), 'public/site-index.json')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, JSON.stringify(index), 'utf-8')

  console.log(
    `[build-site-index] wrote ${outPath} — ${calculatorsIdx.length} calculators, ${posts.length} posts, ${categories.length} categories`
  )
}

// Allow both `tsx` direct run and import-based invocation.
if (import.meta.url === `file://${process.argv[1]}` || fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    console.error('[build-site-index] FATAL:', err)
    // Don't fail the build if data aggregation fails — the widget will
    // gracefully degrade to a smaller index or a fallback prompt.
    process.exit(0)
  })
}

export { main }