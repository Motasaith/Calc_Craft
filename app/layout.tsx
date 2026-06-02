import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CalcCraft - Smart Calculators for Every Calculation',
  description:
    'Fast, accurate and easy to use online calculators for math, finance, health, and everyday needs. Build your own calculator with drag \u0026 drop, embed on your site, and white-label.',
  keywords: [
    'calculator',
    'online calculator',
    'math calculator',
    'finance calculator',
    'BMI calculator',
    'loan calculator',
    'scientific calculator',
    'custom calculator builder',
    'embed calculator',
    'white label calculator',
  ],
  openGraph: {
    title: 'CalcCraft - Smart Calculators for Every Calculation',
    description:
      'Fast, accurate and easy to use online calculators. Build, embed, and white-label your own calculators.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
