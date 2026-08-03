import type { Metadata } from 'next'
import CalculatorsPageClient from './CalculatorsPageClient'

// Catalog page uses ISR to automatically update when new calculators are added to WP
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Calculators Directory',
  description:
    'Browse our directory of 500+ free, accurate online calculators for math, finance, health, conversion, and everyday needs. Built-in visual builder to customize yours.',
  keywords: ['calculators directory', 'free online calculators', 'math calculators', 'finance calculators'],
  alternates: { canonical: 'https://homeofcalculators.com/calculators' },
  openGraph: {
    title: 'Calculators Directory | Home of Calculators',
    description:
      'Browse our directory of 500+ free, accurate online calculators for math, finance, health, conversion, and everyday needs. Built-in visual builder to customize yours.',
    url: 'https://homeofcalculators.com/calculators',
    siteName: 'Home of Calculators',
    type: 'website',
  },
}



export default function CalculatorsPage() {
  return <CalculatorsPageClient />
}
