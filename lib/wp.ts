/**
 * WordPress client — BLOG POSTS ONLY.
 *
 * WordPress is now the CMS for articles and nothing else. Calculators come from
 * the local registry in lib/calculators.ts plus the `calculators` /
 * `user_calculators` tables in CockroachDB; users and their data come from Clerk
 * and the database. The `calculator` custom post type is no longer read.
 *
 * This file previously exported stubs that returned empty arrays for everything,
 * which is why the blog built with a single placeholder page. These are real
 * fetches again.
 *
 * ── AUTHENTICATION ──────────────────────────────────────────────────────────
 * The CMS has a security plugin that refuses anonymous REST access outright:
 *
 *     GET /wp-json/  →  403
 *     {"status":"error","error":"UNAUTHORIZED",
 *      "error_description":"Sorry, you are not allowed to access REST API."}
 *
 * So requests are sent with HTTP Basic auth using WP_USERNAME and
 * WP_APPLICATION_PASSWORD when those are available at build time. Both are
 * server-side only — this module is imported by Server Components during the
 * static export, never shipped to the browser.
 *
 * ── FAILURE BEHAVIOUR ───────────────────────────────────────────────────────
 * Every function degrades to empty rather than throwing. A CMS outage must not
 * fail the whole build and take 1000+ calculator pages down with it; it should
 * cost only the blog. Failures are logged loudly so they are visible in the
 * Cloudflare Pages build output instead of silently shipping an empty blog.
 */

export interface WPPost {
  id: number
  slug: string
  date: string
  modified: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  status?: string
  _embedded?: {
    author?: { name: string; avatar_urls?: Record<string, string> }[]
    'wp:featuredmedia'?: { source_url: string; alt_text?: string }[]
  }
}

const WP_API_URL = process.env.WP_API_URL || 'https://cms.homeofcalculators.com/wp-json'

/** Basic auth header, when an application password is configured. */
function authHeaders(): Record<string, string> {
  const user = process.env.WP_USERNAME
  const pass = process.env.WP_APPLICATION_PASSWORD

  if (!user || !pass) return {}

  // Application passwords are displayed with spaces for readability; WordPress
  // accepts them either way, but strip them so the encoding is predictable.
  const token = Buffer.from(`${user}:${pass.replace(/\s+/g, '')}`).toString('base64')
  return { Authorization: `Basic ${token}` }
}

let warned = false

/** Shared fetch with auth, timeout, and a single loud warning per build. */
async function wpFetch(path: string): Promise<Response | null> {
  const url = `${WP_API_URL.replace(/\/$/, '')}${path}`

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', ...authHeaders() },
      // Next caches fetches during the build; a short revalidate keeps repeat
      // page builds from hammering the CMS.
      next: { revalidate: 60 },
    } as RequestInit)

    if (!res.ok) {
      if (!warned) {
        warned = true
        console.warn(
          `\n[wp] WordPress returned ${res.status} for ${path}.\n` +
            `[wp] The blog will build EMPTY. Most likely causes:\n` +
            `[wp]   • the security plugin is blocking REST access, or\n` +
            `[wp]   • WP_USERNAME / WP_APPLICATION_PASSWORD are missing or revoked.\n` +
            `[wp] Check: curl -u "$WP_USERNAME:$WP_APPLICATION_PASSWORD" ${WP_API_URL}/wp/v2/posts?per_page=1\n`
        )
      }
      return null
    }

    return res
  } catch (err) {
    if (!warned) {
      warned = true
      console.warn(`\n[wp] Could not reach WordPress at ${WP_API_URL}. The blog will build empty.\n`)
    }
    return null
  }
}

/** Published posts, newest first. Embeds author and featured image. */
export async function getPosts(limit = 100): Promise<WPPost[]> {
  const res = await wpFetch(`/wp/v2/posts?per_page=${limit}&status=publish&_embed=1&orderby=date&order=desc`)
  if (!res) return []

  try {
    const posts = await res.json()
    return Array.isArray(posts) ? posts : []
  } catch {
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const res = await wpFetch(`/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`)
  if (!res) return null

  try {
    const posts = await res.json()
    return Array.isArray(posts) && posts.length > 0 ? posts[0] : null
  } catch {
    return null
  }
}

/**
 * Total published posts, read from the X-WP-Total header so the collection is
 * never downloaded. Returns null when WordPress is unreachable, which the admin
 * dashboard renders differently from a genuine zero.
 */
export async function getPostCount(): Promise<number | null> {
  const res = await wpFetch('/wp/v2/posts?per_page=1&status=publish')
  if (!res) return null

  const total = res.headers.get('x-wp-total')
  return total === null ? null : parseInt(total, 10)
}

/** Convenience for the blog index and admin dashboard. */
export function postAuthor(post: WPPost): string {
  return post._embedded?.author?.[0]?.name || 'Home of Calculators'
}

export function postImage(post: WPPost): string | null {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
}

/** Strips HTML for meta descriptions and card excerpts. */
export function plainExcerpt(post: WPPost, maxLength = 160): string {
  const raw = post.excerpt?.rendered || post.content?.rendered || ''
  const text = raw
    .replace(/<[^>]*>/g, '')
    .replace(/&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text
}
