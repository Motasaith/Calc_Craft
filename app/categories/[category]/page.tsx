import type { Metadata } from 'next'
import CategoryPageClient from './CategoryPageClient'

import { CATEGORY_LABELS, CalculatorCategory } from '@/lib/calculators'
import { notFound } from 'next/navigation'
import { OG_IMAGES } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const p = await params
  const categorySlug = p.category as CalculatorCategory
  const label = CATEGORY_LABELS[categorySlug]
  
  if (!label) {
    return { title: 'Category Not Found | Home of Calculators' }
  }

  return {
    title: `${label} Calculators`,
    description: `Browse our complete collection of free online ${label.toLowerCase()} calculators. Fast, accurate, mobile-friendly, and completely free to use.`,
    keywords: [`${label.toLowerCase()} calculators`, 'free online calculators', label.toLowerCase()],
    alternates: { canonical: `https://homeofcalculators.com/categories/${categorySlug}` },
    openGraph: {
      images: OG_IMAGES,
      title: `${label} Calculators | Home of Calculators`,
      description: `Browse our complete collection of free online ${label.toLowerCase()} calculators. Fast, accurate, mobile-friendly, and completely free to use.`,
      url: `https://homeofcalculators.com/categories/${categorySlug}`,
      siteName: 'Home of Calculators',
      type: 'website',
    },
  }
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_LABELS).map((category) => ({
    category,
  }))
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const p = await params
  const categorySlug = p.category as CalculatorCategory
  
  if (!CATEGORY_LABELS[categorySlug]) {
    notFound()
  }

  
  return <CategoryPageClient categorySlug={categorySlug} />
}
