import { getAllSlugs, getCalculatorBySlug as getLocalCalc } from '@/lib/calculators'
import type { Metadata } from 'next'
import CalculatorPageClient from './CalculatorPageClient'
import { OG_IMAGES, TWITTER_IMAGES, calculatorDescription, pageTitle } from '@/lib/seo'

export const dynamicParams = false
export const revalidate = 60

export async function generateStaticParams() {
  const localSlugs = getAllSlugs().map((slug) => ({ slug }))
  return localSlugs
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const localCalc = getLocalCalc(slug)

  const title = localCalc?.name || 'Calculator'
  const baseDescription = localCalc?.description || `Use the ${title} to solve your problems instantly.`

  if (!localCalc) return { title: 'Calculator Not Found' }

  // Composed rather than concatenated: the previous form appended a fixed
  // sentence to registry blurbs that run 29–85 characters, which left 221 of
  // these pages under the ~120-character minimum. The old title added
  // "- Free Calculator" on top of the layout's brand template, pushing 294
  // titles past 60 characters even though no calculator name is that long.
  const description = calculatorDescription(baseDescription, localCalc.category)

  return {
    title: pageTitle(title),
    description,
    openGraph: {
      images: OG_IMAGES,
      title: `${title} | Home of Calculators`,
      description,
      type: 'website',
      url: `https://homeofcalculators.com/calculators/${slug}`,
      siteName: 'Home of Calculators',
    },
    twitter: {
      images: TWITTER_IMAGES,
      card: 'summary_large_image',
      title: `${title} | Home of Calculators`,
      description,
    },
    alternates: { canonical: `https://homeofcalculators.com/calculators/${slug}` },
  }
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const localCalc = getLocalCalc(slug)

  if (localCalc) {
    // Create a synthetic object to match the component props
    const syntheticCalc = {
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
    return <CalculatorPageClient calc={syntheticCalc as any} />
  }

  return (
    <div className="min-h-screen pt-32 text-center">
      <h1 className="text-2xl font-bold">Calculator Not Found</h1>
    </div>
  )
}
