import type { Metadata } from 'next'
import CategoriesPageClient from './CategoriesPageClient'
import { OG_IMAGES } from '@/lib/seo'


export const revalidate = 60

export const metadata: Metadata = {
  title: 'Calculator Categories',
  description:
    'Browse our comprehensive list of calculator categories including math, finance, health, and engineering. Find the exact tool you need.',
  keywords: ['calculator categories', 'math calculators', 'finance calculators', 'health calculators', 'engineering calculators'],
  alternates: { canonical: 'https://homeofcalculators.com/categories' },
  openGraph: {
    images: OG_IMAGES,
    title: 'Calculator Categories | Home of Calculators',
    description:
      'Browse our comprehensive list of calculator categories including math, finance, health, and engineering. Find the exact tool you need.',
    url: 'https://homeofcalculators.com/categories',
    siteName: 'Home of Calculators',
    type: 'website',
  },
}

export default function CategoriesPage() {
  return <CategoriesPageClient />
}
