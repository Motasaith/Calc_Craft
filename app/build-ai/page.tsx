import type { Metadata } from 'next'
import AiBuilderPageClient from './AiBuilderPageClient'

// SEO: this is a static page (works with output: 'export' on Cloudflare Pages).
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'AI Calculator Builder - Describe It, Embed It on Your Site | Home of Calculators',
  description:
    'Build a custom calculator for your website by describing it in plain English. The AI designs the fields, writes the formulas, and brands it for your business — then gives you an embed code for WordPress, Shopify, Webflow or any site.',
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
