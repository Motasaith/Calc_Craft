import { Metadata } from 'next'
import CasioHeroCalculator from '@/components/CasioHeroCalculator'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Casio Scientific Calculator | Home of Calculators',
  description: 'A fully functional classic Casio-style scientific calculator in your browser.',
}

export default function CasioPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow flex flex-col justify-center items-center">
        <div className="w-full flex justify-start mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-dark-500 hover:text-dark-900 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark-900 tracking-tight mb-4">
            Classic Scientific Calculator
          </h1>
          <p className="text-dark-600 max-w-2xl mx-auto text-lg">
            Experience the nostalgia and power of a classic scientific calculator right in your browser. Fully functional, responsive, and completely free.
          </p>
        </div>

        <div className="w-full flex justify-center [perspective:1200px] mb-20">
          <CasioHeroCalculator />
        </div>
      </div>
    </div>
  )
}
