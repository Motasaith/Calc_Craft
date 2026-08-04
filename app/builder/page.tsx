import type { Metadata } from 'next'
import BuilderPageClient from './BuilderPageClient'
import { OG_IMAGES } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Visual Calculator Builder',
  description:
    'Use our drag-and-drop, no-code visual calculator builder to design, theme, brand, and embed custom calculator widgets on any website in under 5 minutes.',
  keywords: ['visual builder', 'custom calculator builder', 'no code calculator', 'embed calculator widget'],
  alternates: { canonical: 'https://homeofcalculators.com/builder' },
  openGraph: {
    images: OG_IMAGES,
    title: 'Visual Calculator Builder | Home of Calculators',
    description:
      'Use our drag-and-drop, no-code visual calculator builder to design, theme, brand, and embed custom calculator widgets on any website in under 5 minutes.',
    url: 'https://homeofcalculators.com/builder',
    siteName: 'Home of Calculators',
    type: 'website',
  },
}

export default function BuilderPage() {
  return <BuilderPageClient />
}
