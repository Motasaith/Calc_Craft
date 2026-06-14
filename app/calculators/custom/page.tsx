import type { Metadata } from 'next'
import CustomCalculatorPageClient from './CustomCalculatorPageClient'

export const metadata: Metadata = {
  title: 'Custom Calculator - Home of Calculators',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CustomCalculatorPage() {
  return <CustomCalculatorPageClient />
}
