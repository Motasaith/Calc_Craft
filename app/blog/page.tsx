import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Home of Calculators Blog - Calculator Tips, Tutorials & Industry Insights | Home of Calculators',
  description:
    'In-depth guides on using calculators for finance, health, math, and everyday life. Plus tutorials on building custom calculators with our visual builder and embedding them anywhere.',
  keywords: [
    'calculator blog',
    'finance tips',
    'math tutorials',
    'health calculator guide',
    'visual builder tutorial',
    'embed calculator',
  ],
  openGraph: {
    title: 'Home of Calculators Blog | Home of Calculators',
    description: 'Tips, tutorials, and industry insights on calculators and custom calculator development.',
    type: 'website',
  },
  alternates: { canonical: 'https://homeofcalculators.com/blog' },
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white flex flex-col items-center justify-center pt-24 pb-10 px-4 text-center">
        <BookOpen className="w-12 h-12 text-primary-300 mb-4" />
        <h1 className="text-3xl font-extrabold text-dark-900 mb-2">Our Blog is Coming Soon</h1>
        <p className="text-dark-500 max-w-md">We are migrating to a new platform. Check back later for fresh tutorials and insights.</p>
      </main>
      <Footer />
    </>
  )
}

