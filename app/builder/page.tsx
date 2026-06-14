import type { Metadata } from 'next'
import BuilderPageClient from './BuilderPageClient'

export const metadata: Metadata = {
  title: 'Visual Calculator Builder - Design Custom Calculator Widgets | Home of Calculators',
  description:
    'Use our drag-and-drop, no-code visual calculator builder to design, theme, brand, and embed custom calculator widgets on any website in under 5 minutes.',
  keywords: ['visual builder', 'custom calculator builder', 'no code calculator', 'embed calculator widget'],
  alternates: { canonical: 'https://homeofcalculators.com/builder' },
}

export default function BuilderPage() {
  return <BuilderPageClient />
}
