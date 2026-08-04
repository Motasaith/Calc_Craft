import type { Metadata } from 'next'
import AiBuilderPageClient from './AiBuilderPageClient'
import { OG_IMAGES, pageTitle } from '@/lib/seo'

// SEO: this is a static page (works with output: 'export' on Cloudflare Pages).
export const dynamic = 'force-static'

export const metadata: Metadata = {
  // pageTitle() appends the brand once and guarantees the 60-character limit.
  // Writing "| Home of Calculators" by hand meant the layout template appended
  // it a second time, giving a 100-character double-branded title.
  title: pageTitle('AI Calculator Builder — No Code'),
  description:
    'Describe a calculator in plain English and the AI builds it — fields, formulas and your branding — then hands you an embed code for any website.',
  keywords: [
    'ai calculator builder',
    'build a calculator with ai',
    'custom calculator for website',
    'embed calculator on website',
    'calculator widget generator',
    'no code calculator builder',
    'quote calculator builder',
    'pricing calculator for my business',
  ],
  alternates: { canonical: 'https://homeofcalculators.com/build-ai' },
  openGraph: {
    images: OG_IMAGES,
    title: 'AI Calculator Builder - Describe It, Embed It on Your Site',
    description:
      'Describe the calculator you need in plain English. The AI builds it, brands it for your business, and hands you an embed code for your website.',
    url: 'https://homeofcalculators.com/build-ai',
    type: 'website',
  },
}

export default function BuildAiPage() {
  return <AiBuilderPageClient />
}
