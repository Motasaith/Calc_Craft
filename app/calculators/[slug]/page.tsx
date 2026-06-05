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

  const title = `${calc.name} - Free Online Calculator | Calc_Craft`
  const description = `${calc.description} Fast, accurate, and 100% free. Runs entirely in your browser — no signup, no tracking, no ads.`

  return {
    title,
    description,
    keywords: [
      calc.shortName.toLowerCase(),
      `${calc.shortName.toLowerCase()} calculator`,
      'free online calculator',
      CATEGORY_LABELS[calc.category].toLowerCase(),
      'no signup calculator',
      'browser calculator',
      ...calc.keywords,
    ],
    openGraph: {
      title: `${calc.name} | Calc_Craft`,
      description,
      type: 'website',
      url: `https://calc_craft.com/calculators/${slug}`,
      siteName: 'Calc_Craft',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${calc.name} | Calc_Craft`,
      description,
    },
    alternates: { canonical: `https://calc_craft.com/calculators/${slug}` },
  }
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <CalculatorPageClient slug={slug} />
}
