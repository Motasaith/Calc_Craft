import { MetadataRoute } from 'next'
import { getAllSlugs, calculators } from '@/lib/calculators'
import { getPublishedPostSlugs } from '@/lib/db/queries'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://homeofcalculators.com'
  const now = new Date()
  const slugs = getAllSlugs()

  // Merge static blog slugs with published DB posts.
  const staticBlogSlugs = [
    'how-to-build-custom-calculator-no-code',
    'understanding-loan-emi-calculation',
    'calculator-engines-mathjs-precision',
  ]
  let dbBlogSlugs: string[] = []
  try {
    dbBlogSlugs = await getPublishedPostSlugs()
  } catch {
    // DB not configured — static-only sitemap.
  }
  const allBlogSlugs = Array.from(new Set([...staticBlogSlugs, ...dbBlogSlugs]))

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
    ...allBlogSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // Individual calculators (auto-generated with names for better context)
    ...slugs.map((slug) => {
      const calc = calculators.find((c) => c.slug === slug)
      return {
        url: `${baseUrl}/calculators/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        ...(calc ? { images: [`https://homeofcalculators.com/og-image.png`] } : {}),
      }
    }),
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
