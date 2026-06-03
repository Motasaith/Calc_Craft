import { getAllSlugs, getCalculatorBySlug, CATEGORY_LABELS } from '@/lib/calculators'
import type { Metadata } from 'next'
import CalculatorPageClient from './CalculatorPageClient'

// Generate static params for all calculator slugs
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

// Generate metadata per calculator
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const calc = getCalculatorBySlug(slug)
  if (!calc) return { title: 'Calculator Not Found' }

  return {
    title: `${calc.name} - Free Online ${CATEGORY_LABELS[calc.category]} Calculator`,
    description: calc.description,
    keywords: calc.keywords,
    openGraph: {
      title: `${calc.name} | Calc_Craft`,
      description: calc.description,
      type: 'website',
    },
  }
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <CalculatorPageClient slug={slug} />
}
