import type { Metadata } from 'next'
import CategoriesPageClient from './CategoriesPageClient'
import { getCalculators } from '@/lib/wp'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Calculator Categories - Browse All Categories | Home of Calculators',
  description:
    'Browse our comprehensive list of calculator categories including math, finance, health, and engineering. Find the exact tool you need.',
  keywords: ['calculator categories', 'math calculators', 'finance calculators', 'health calculators', 'engineering calculators'],
  alternates: { canonical: 'https://homeofcalculators.com/categories' },
}

export default async function CategoriesPage() {
  const wpCalculators = await getCalculators()
  return <CategoriesPageClient wpCalculators={wpCalculators} />
}
