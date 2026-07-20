import type { Metadata } from 'next'
import SolverPageClient from './SolverPageClient'

// SEO: this is a static page (works with output: 'export' on Cloudflare Pages).
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'AI Math Solver - Snap a Photo, Get the Answer & Steps | Home of Calculators',
  description:
    'Free AI math solver. Upload or photograph any math problem and get the answer plus a clear, detailed step-by-step explanation. Algebra, calculus, arithmetic, word problems. No signup.',
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