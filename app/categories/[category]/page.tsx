import type { Metadata } from 'next'
import CategoryPageClient from './CategoryPageClient'
import { getCalculators } from '@/lib/wp'
import { CATEGORY_LABELS, CalculatorCategory } from '@/lib/calculators'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const p = await params
  const categorySlug = p.category as CalculatorCategory
  const label = CATEGORY_LABELS[categorySlug]
  
  if (!label) {
    return { title: 'Category Not Found | Home of Calculators' }
  }

  return {
    title: `${label} Calculators - Free Online Tools | Home of Calculators`,
    description: `Browse our collection of free online ${label.toLowerCase()} calculators. Easy to use, highly accurate, and completely free.`,
    keywords: [`${label.toLowerCase()} calculators`, 'free online calculators', label.toLowerCase()],
    alternates: { canonical: `https://homeofcalculators.com/categories/${categorySlug}` },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const p = await params
  const categorySlug = p.category as CalculatorCategory
  
  if (!CATEGORY_LABELS[categorySlug]) {
    notFound()
  }

  const wpCalculators = await getCalculators()
  
  return <CategoryPageClient categorySlug={categorySlug} wpCalculators={wpCalculators} />
}
