import { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/calculators'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://homeofcalculators.com'
  const now = new Date()
  const slugs = getAllSlugs()

  return [
    // Homepage
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    // Catalog
    { url: `${baseUrl}/calculators`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    // Builder
    { url: `${baseUrl}/builder`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Blog index
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    // About
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // Contact
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    // Blog posts
    ...[
      'how-to-build-custom-calculator-no-code',
      'understanding-loan-emi-calculation',
      'calculator-engines-mathjs-precision',
    ].map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // Individual calculators (auto-generated)
    ...slugs.map((slug) => ({
      url: `${baseUrl}/calculators/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // Legal
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-of-use`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
