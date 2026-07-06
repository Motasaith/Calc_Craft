import { getCalculators, getCalculatorBySlug, type WPCalculator } from '@/lib/wp'
import { getAllSlugs, getCalculatorBySlug as getLocalCalc } from '@/lib/calculators'
import type { Metadata } from 'next'
import CalculatorPageClient from './CalculatorPageClient'

// Allow dynamic generation of new calculators published to WP after build
export const dynamicParams = false
export const revalidate = 60

export async function generateStaticParams() {
  // Fetch WordPress calculators
  const wpCalcs = await getCalculators()
  const wpSlugs = wpCalcs.map((calc) => ({ slug: calc.slug }))

  // Also include all local registry slugs as fallback
  // This ensures pages are generated even if WordPress rate-limits during build
  const localSlugs = getAllSlugs().map((slug) => ({ slug }))

  // Deduplicate: merge WP slugs with local-only slugs
  const wpSlugSet = new Set(wpSlugs.map((s) => s.slug))
  const merged = [...wpSlugs, ...localSlugs.filter((s) => !wpSlugSet.has(s.slug))]

  return merged
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const calc = await getCalculatorBySlug(slug)
  const localCalc = getLocalCalc(slug)

  // Use WP title if available, otherwise fall back to local registry
  const title = calc ? calc.title.rendered : (localCalc?.name || 'Calculator')
  const description = localCalc?.description || `Use the ${title} to solve your problems instantly. Fast, accurate, and completely free.`

  if (!calc && !localCalc) return { title: 'Calculator Not Found' }

  return {
    title: `${title} - Free Online Calculator | Home of Calculators`,
    description,
    openGraph: {
      title: `${title} | Home of Calculators`,
      description,
      type: 'website',
      url: `https://homeofcalculators.com/calculators/${slug}`,
      siteName: 'Home of Calculators',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Home of Calculators`,
      description,
    },
    alternates: { canonical: `https://homeofcalculators.com/calculators/${slug}` },
  }
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const calc = await getCalculatorBySlug(slug)

  if (calc) {
    return <CalculatorPageClient calc={calc} />
  }

  // Fallback: if WordPress fails (rate-limit, 403, etc.), use local registry
  const localCalc = getLocalCalc(slug)
  if (localCalc) {
    // Create a synthetic WPCalculator object from local registry data
    const syntheticCalc: WPCalculator = {
      id: 0,
      slug: localCalc.slug,
      title: { rendered: localCalc.name },
      content: { rendered: localCalc.description },
      acf: {
        brand_name: 'Home of Calculators',
        theme: 'modern',
        layout: 'standard',
        require_submit: false,
        calculator_type: 'react',
        react_component_id: localCalc.slug,
        input_1_name: '',
        math_formula: '',
      },
    }
    return <CalculatorPageClient calc={syntheticCalc} />
  }

  return (
    <div className="min-h-screen pt-32 text-center">
      <h1 className="text-2xl font-bold">Calculator Not Found</h1>
    </div>
  )
}
