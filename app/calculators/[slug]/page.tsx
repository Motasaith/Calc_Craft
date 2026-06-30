import { getCalculators, getCalculatorBySlug } from '@/lib/wp'
import type { Metadata } from 'next'
import CalculatorPageClient from './CalculatorPageClient'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  const calculators = await getCalculators()
  return calculators.map((calc) => ({ slug: calc.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const calc = await getCalculatorBySlug(slug)
  if (!calc) return { title: 'Calculator Not Found' }

  const title = `${calc.title.rendered} - Free Online Calculator | Home of Calculators`
  const description = `Use the ${calc.title.rendered} to solve your problems instantly. Fast, accurate, and completely free.`

  return {
    title,
    description,
    openGraph: {
      title: `${calc.title.rendered} | Home of Calculators`,
      description,
      type: 'website',
      url: `https://homeofcalculators.com/calculators/${slug}`,
      siteName: 'Home of Calculators',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${calc.title.rendered} | Home of Calculators`,
      description,
    },
    alternates: { canonical: `https://homeofcalculators.com/calculators/${slug}` },
  }
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const calc = await getCalculatorBySlug(slug)
  
  if (!calc) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="text-2xl font-bold">Calculator Not Found</h1>
      </div>
    )
  }

  return <CalculatorPageClient calc={calc} />
}
