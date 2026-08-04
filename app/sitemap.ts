import { MetadataRoute } from 'next'
import { getPosts } from '@/lib/wp'
import { calculators as localCalculators, CATEGORY_LABELS } from '@/lib/calculators'

export const dynamic = 'force-static'
export const revalidate = false

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://homeofcalculators.com'
  const now = new Date()
  
  // Blog posts come from WordPress; an outage there costs the blog URLs, not
  // the build. Calculators come from the local registry, so they are always
  // present regardless of the CMS.
  const posts = await getPosts().catch(() => [])
  const calculators = localCalculators
  const categories = Object.keys(CATEGORY_LABELS)

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      images: ['https://homeofcalculators.com/og-image.png'],
    },
    // Catalog
    {
      url: `${baseUrl}/calculators`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Builder
    {
      url: `${baseUrl}/builder`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // AI Math Solver
    {
      url: `${baseUrl}/solver`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // AI Calculator Builder
    {
      url: `${baseUrl}/build-ai`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Blog index
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // About
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Contact
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    // Blog posts
    ...posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.modified || post.date || now),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // Standalone emulator route. It is indexable but is not part of the
    // calculator registry, so the generated list below does not cover it.
    {
      url: `${baseUrl}/calculators/casio`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    // Category hub. Its children were all listed but the hub itself was not,
    // leaving an indexable page absent from the sitemap.
    {
      url: `${baseUrl}/categories`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // Categories
    ...categories.map((cat: string) => ({
      url: `${baseUrl}/categories/${cat}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // Individual calculators
    ...calculators.map((calc: any) => ({
      url: `${baseUrl}/calculators/${calc.slug}`,
      lastModified: new Date(calc.modified || calc.date || now),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      images: ['https://homeofcalculators.com/og-image.png'],
    })),
    // Legal
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-use`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
