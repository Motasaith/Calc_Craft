import { MetadataRoute } from 'next'
import { getPosts, getCalculators } from '@/lib/wp'

export const dynamic = 'force-static'
export const revalidate = false

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://homeofcalculators.com'
  const now = new Date()
  
  const [posts, calculators] = await Promise.all([
    getPosts(),
    getCalculators()
  ])

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
    ...posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.modified || post.date || now),
      changeFrequency: 'monthly' as const,
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
