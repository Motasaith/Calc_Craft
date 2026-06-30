import type { Metadata } from 'next'
import CalculatorsPageClient from './CalculatorsPageClient'

// Catalog page is statically prerendered at build time; the client component
// handles search/filter interactivity after hydration.
export const dynamic = 'force-static'
export const revalidate = false

export const metadata: Metadata = {
  title: 'Calculators Directory - Browse All Free Online Calculators | Home of Calculators',
  description:
    'Browse our directory of 190 free, accurate online calculators for math, finance, health, conversion, and everyday needs. Built-in visual builder to customize yours.',
  keywords: ['calculators directory', 'free online calculators', 'math calculators', 'finance calculators'],
  alternates: { canonical: 'https://homeofcalculators.com/calculators' },
}

import { getCalculators } from '@/lib/wp'

export default async function CalculatorsPage() {
  const wpCalculators = await getCalculators()
  return <CalculatorsPageClient wpCalculators={wpCalculators} />
}
