'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, LayoutGrid } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { calculators, CATEGORY_LABELS, CATEGORY_COLORS, CalculatorCategory } from '@/lib/calculators'
import { WPCalculator } from '@/lib/wp'

interface Props {
  wpCalculators: WPCalculator[]
}

export default function CategoriesPageClient({ wpCalculators }: Props) {
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}
    
    calculators.forEach(calc => {
      counts[calc.category] = (counts[calc.category] || 0) + 1
    })
    
    return counts
  }, [wpCalculators])

  const categoryKeys = Object.keys(CATEGORY_LABELS) as CalculatorCategory[]

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-dark-900 tracking-tight mb-4 flex items-center justify-center gap-3">
              <LayoutGrid className="w-10 h-10 text-primary-500" />
              Calculator Categories
            </h1>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Browse our extensive collection of {calculators.length} free online calculators, organized into {categoryKeys.length} categories to help you quickly find what you need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryKeys.map((cat, idx) => {
              const label = CATEGORY_LABELS[cat]
              const colors = CATEGORY_COLORS[cat] || { bg: 'bg-neutral-50', text: 'text-neutral-600', border: 'border-neutral-200' }
              const count = categoryCounts[cat] || 0
              
              if (count === 0) return null

              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                >
                  <Link
                    href={`/categories/${cat}`}
                    className={`block h-full p-5 rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-white ${colors.border}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${colors.bg} ${colors.text}`}>
                        {label.charAt(0)}
                      </div>
                      <ChevronRight className={`w-5 h-5 ${colors.text} opacity-50`} />
                    </div>
                    <h2 className="text-lg font-bold text-dark-900 mb-1">{label}</h2>
                    <p className="text-sm text-dark-500">{count} {count === 1 ? 'Calculator' : 'Calculators'}</p>
                  </Link>
                </motion.div>
              )
            })}
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
