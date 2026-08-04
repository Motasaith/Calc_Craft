import type { Metadata } from 'next'
import SolverPageClient from './SolverPageClient'
import { OG_IMAGES, pageTitle } from '@/lib/seo'

// SEO: this is a static page (works with output: 'export' on Cloudflare Pages).
export const dynamic = 'force-static'

export const metadata: Metadata = {
  // pageTitle() appends the brand once and guarantees the 60-character limit.
  // Writing "| Home of Calculators" by hand meant the layout template appended
  // it a second time, giving a 96-character double-branded title.
  title: pageTitle('AI Math Solver — Photo to Answer'),
  description:
    'Free AI math solver. Photograph any problem and get the answer with clear step-by-step working. Algebra, calculus, arithmetic and word problems.',
  keywords: [
    'ai math solver',
    'photo math solver',
    'solve math by picture',
    'step by step math solver',
    'ai homework helper',
    'math camera solver',
    'equation solver ai',
    'word problem solver',
  ],
  alternates: { canonical: 'https://homeofcalculators.com/solver' },
  openGraph: {

    images: OG_IMAGES,
    title: 'AI Math Solver - Snap a Photo, Get the Answer & Steps',
    description:
      'Upload or photograph any math problem and get the answer plus a clear step-by-step explanation. Free, no signup.',
    url: 'https://homeofcalculators.com/solver',
    type: 'website',
  },
}

export default function SolverPage() {
  return <SolverPageClient />
}