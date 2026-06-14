import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Home of Calculators - Smart Calculators for Every Calculation',
    short_name: 'Home of Calculators',
    description:
      'Fast, accurate and free online calculators for math, finance, health, and everyday needs. 190 calculators, no signup required.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#1a1a1f',
    orientation: 'any',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['utilities', 'productivity', 'education'],
    lang: 'en',
    dir: 'ltr',
    scope: '/',
    shortcuts: [
      {
        name: 'Basic Calculator',
        short_name: 'Basic',
        description: 'Open the basic calculator',
        url: '/calculators/basic',
        icons: [{ src: '/icon-calculator.png', sizes: '96x96' }],
      },
      {
        name: 'BMI Calculator',
        short_name: 'BMI',
        description: 'Calculate your Body Mass Index',
        url: '/calculators/bmi',
        icons: [{ src: '/icon-bmi.png', sizes: '96x96' }],
      },
      {
        name: 'Loan Calculator',
        short_name: 'Loan',
        description: 'Calculate loan EMI and interest',
        url: '/calculators/loan',
        icons: [{ src: '/icon-loan.png', sizes: '96x96' }],
      },
    ],
  }
}
