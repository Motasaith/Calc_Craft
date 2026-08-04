import { BRAND } from './brand'

// Next.js metadata does NOT deep-merge. A page that declares `openGraph`
// replaces the root layout's object entirely rather than extending it, so any
// page setting its own title/description silently drops the inherited images.
//
// That is how all 488 calculator pages ended up shipping og: tags with no
// og:image at all, which an SEO crawler reports as "Open Graph tags
// incomplete". Every page that declares social metadata has to restate the
// images, so they live here rather than being retyped per file.

export const OG_IMAGES = [
  {
    url: `${BRAND.url}/og-image.png`,
    width: 1200,
    height: 630,
    alt: `${BRAND.name} — 500+ free online calculators for math, finance and health`,
  },
]

export const TWITTER_IMAGES = [`${BRAND.url}/twitter-image.png`]

// ─────────────────────────────────────────────────────────────────────────────
//  Title and description composition
// ─────────────────────────────────────────────────────────────────────────────
// Search engines truncate titles past ~60 characters and descriptions outside
// roughly 120–160. Both limits were being missed structurally rather than
// occasionally, so these compose to fit instead of leaving it to whoever writes
// the next page.

const TITLE_SUFFIX = ` | ${BRAND.name}`
export const TITLE_MAX = 60
export const DESC_MIN = 120
export const DESC_MAX = 160

/**
 * Builds a page title that fits, and returns it as `absolute` so the root
 * layout's `%s | Home of Calculators` template cannot append the brand a
 * second time — that double-suffixing is what produced titles reading
 * "... Embed | Home of Calculators | Home of Calculators" on 488 pages.
 *
 * The brand suffix is dropped rather than the page's own name when the two
 * together would overflow: the name is what distinguishes the result.
 */
export function pageTitle(name: string): { absolute: string } {
  const withBrand = `${name}${TITLE_SUFFIX}`
  return { absolute: withBrand.length <= TITLE_MAX ? withBrand : name }
}

/**
 * Description for a blog post, falling back to the title when the WordPress
 * excerpt is too thin to stand alone. Excerpts are author-controlled and some
 * are a handful of characters, which produces a meta description search
 * engines will simply discard.
 */
export function blogDescription(title: string, excerpt: string): string {
  const clean = excerpt.replace(/\s+/g, ' ').trim()
  if (clean.length >= DESC_MIN) return clean.slice(0, DESC_MAX).replace(/\s+\S*$/, '')

  let head = clean
  if (head && !/[.!?]$/.test(head)) head += '.'
  const lead = head ? `${head} ` : ''
  const composed = `${lead}Read ${title} on the ${BRAND.name} blog — guides and explainers on calculators, formulas and everyday maths.`
  return composed.length > DESC_MAX ? composed.slice(0, DESC_MAX).replace(/\s+\S*$/, '') : composed
}

/** Human-readable category name, e.g. "date-time" → "date and time". */
function categoryLabel(category: string): string {
  const special: Record<string, string> = {
    'date-time': 'date and time',
    'real-estate': 'real estate',
  }
  return special[category] ?? category.replace(/-/g, ' ')
}

/**
 * Extends a short registry blurb into the 120–160 character band.
 *
 * The blurbs run 29–85 characters, so a single fixed tail sentence either left
 * the result short or pushed it long depending on the starting text. Candidate
 * tails are tried longest-first and the first one that lands in range wins,
 * which also varies the wording by category instead of repeating one sentence
 * across every page.
 */
export function calculatorDescription(base: string, category: string): string {
  const cat = categoryLabel(category)

  let head = base.trim()
  if (head && !/[.!?]$/.test(head)) head += '.'

  const tails = [
    ` Free online ${cat} calculator with instant results, worked examples and no signup required.`,
    ` Free online ${cat} calculator — instant results, no signup required.`,
    ` Free ${cat} calculator with instant, accurate results.`,
    ` Free and accurate, with no signup.`,
    '',
  ]

  for (const tail of tails) {
    const candidate = `${head}${tail}`
    if (candidate.length >= DESC_MIN && candidate.length <= DESC_MAX) return candidate
  }

  // Nothing landed in range. Prefer slightly long over truncated mid-sentence,
  // but never overflow: trim back to a word boundary.
  const longest = `${head}${tails[0]}`
  if (longest.length <= DESC_MAX) return longest
  return head.length <= DESC_MAX ? head : `${head.slice(0, DESC_MAX - 1).replace(/\s+\S*$/, '')}…`
}
