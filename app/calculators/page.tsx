import type { Metadata } from 'next'
import CalculatorsPageClient from './CalculatorsPageClient'
import { OG_IMAGES } from '@/lib/seo'

// Catalog page uses ISR to automatically update when new calculators are added to WP
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Calculators Directory',
  description:
    'Browse 500+ free, accurate online calculators for math, finance, health and conversion — plus a visual builder to create your own.',
  keywords: ['calculators directory', 'free online calculators', 'math calculators', 'finance calculators'],
  alternates: { canonical: 'https://homeofcalculators.com/calculators' },
  openGraph: {
    images: OG_IMAGES,
    title: 'Calculators Directory | Home of Calculators',
    description:
      'Browse 500+ free, accurate online calculators for math, finance, health and conversion — plus a visual builder to create your own.',
    url: 'https://homeofcalculators.com/calculators',
    siteName: 'Home of Calculators',
    type: 'website',
  },
}



export default function CalculatorsPage() {
  return <CalculatorsPageClient />
}
