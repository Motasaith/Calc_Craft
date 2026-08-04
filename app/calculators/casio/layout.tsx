import type { Metadata } from 'next'
import React from 'react'
import { OG_IMAGES } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Classic fx-991EX Scientific Emulator',
  description:
    'Use our high-fidelity classic scientific calculator emulator in your browser. Tactical hardware layout, multiple themes, and keyboard shortcut support.',
  keywords: [
    'fx-991ex emulator',
    'casio emulator',
    'online scientific calculator',
    'scientific calculator emulator',
    'classwiz emulator',
  ],
  alternates: { canonical: 'https://homeofcalculators.com/calculators/casio' },
  openGraph: {
    images: OG_IMAGES,
    title: 'Classic fx-991EX Emulator - Interactive Scientific Calculator | Home of Calculators',
    description:
      'Use our high-fidelity classic scientific calculator emulator in your browser. Tactical hardware layout, multiple themes, and keyboard shortcut support.',
    url: 'https://homeofcalculators.com/calculators/casio',
    siteName: 'Home of Calculators',
    type: 'website',
  },
}

export default function CasioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
