'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowLeft, Calculator as CalculatorIcon, LayoutGrid } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { calculators, CATEGORY_LABELS, CATEGORY_COLORS, CalculatorCategory } from '@/lib/calculators'
import { WPCalculator } from '@/lib/wp'
import CalculatorCard from '@/components/calculators/CalculatorCard'
import { notFound } from 'next/navigation'

interface Props {
  categorySlug: string
  wpCalculators: WPCalculator[]
}

export default function CategoryPageClient({ categorySlug, wpCalculators }: Props) {
  // Validate category
  if (!CATEGORY_LABELS[categorySlug as CalculatorCategory]) {
    notFound()
  }

  const category = categorySlug as CalculatorCategory
  const label = CATEGORY_LABELS[category]
  const colors = CATEGORY_COLORS[category] || { bg: 'bg-neutral-50', text: 'text-neutral-600', border: 'border-neutral-200' }

  // Filter calculators for this category
  const filteredCalculators = React.useMemo(() => {
    return calculators.filter(calc => calc.category === category)
  }, [category])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumbs & Header */}
          <div className="mb-10">
            <Link href="/categories" className="inline-flex items-center gap-1.5 text-sm font-bold text-dark-500 hover:text-dark-900 transition-colors mb-6 bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Categories
            </Link>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl ${colors.bg} ${colors.text} shadow-sm border ${colors.border}`}>
                {label.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-dark-900 tracking-tight">
                  {label} Calculators
                </h1>
                <p className="text-dark-600 mt-1">
                  {filteredCalculators.length} {filteredCalculators.length === 1 ? 'calculator' : 'calculators'} in this category
                </p>
              </div>
            </div>
          </div>

          {/* Calculators Grid */}
          {filteredCalculators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCalculators.map((calc, i) => (
                <motion.div
                  key={calc.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="h-full"
                >
                  <CalculatorCard calc={calc} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-sm">
              <CalculatorIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark-900 mb-2">No calculators found</h3>
              <p className="text-dark-500">We are still building calculators for this category.</p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
