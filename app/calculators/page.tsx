'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calculator, Search, ArrowRight, Wrench, Trash2, Plus, Sparkles } from 'lucide-react'
import { calculators, CATEGORY_LABELS, CATEGORY_COLORS, type CalculatorCategory } from '@/lib/calculators'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { serializeConfig } from '@/lib/url-serializer'
import { CustomCalculatorConfig } from '@/components/calculators/shared/CustomCalculatorRenderer'

type CategoryFilter = CalculatorCategory | 'all' | 'custom'

export default function CalculatorsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const [search, setSearch] = useState('')
  const [customCalculators, setCustomCalculators] = useState<CustomCalculatorConfig[]>([])

  // Load custom calculators from localStorage on mount
  useEffect(() => {
    const listRaw = localStorage.getItem('my_custom_calculators')
    if (listRaw) {
      try {
        setCustomCalculators(JSON.parse(listRaw))
      } catch (e) {
        console.warn('Failed to parse custom calculators')
      }
    }
  }, [])

  const handleDeleteCustom = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (confirm('Are you sure you want to delete this custom calculator from your site dashboard?')) {
      const updated = customCalculators.filter((c) => c.id !== id)
      setCustomCalculators(updated)
      localStorage.setItem('my_custom_calculators', JSON.stringify(updated))
      if (activeCategory === 'custom' && updated.length === 0) {
        setActiveCategory('all')
      }
    }
  }

  const categoriesList = useMemo(() => {
    const list: CategoryFilter[] = ['all']
    if (customCalculators.length > 0) {
      list.push('custom')
    }
    const standardCats: CategoryFilter[] = ['math', 'finance', 'health', 'date-time', 'conversion', 'everyday']
    return [...list, ...standardCats]
  }, [customCalculators])

  // Filtered calculators (combining registry and custom calculators)
  const filtered = useMemo(() => {
    let standardList = calculators.map((c) => ({
      ...c,
      isCustom: false,
      customConfig: null as CustomCalculatorConfig | null,
    }))

    let customList = customCalculators.map((c) => ({
      slug: `custom-${c.id}`,
      name: c.name,
      shortName: c.brandName || 'Custom',
      category: 'everyday' as CalculatorCategory, // Default fallback category for UI colors
      description: c.description,
      keywords: [c.name.toLowerCase(), 'custom calculator'],
      mode: 'form' as const,
      icon: 'Wrench',
      isCustom: true,
      customConfig: c,
    }))

    let combined = [...standardList, ...customList]

    // Apply category filters
    if (activeCategory === 'custom') {
      combined = combined.filter((c) => c.isCustom)
    } else if (activeCategory !== 'all') {
      combined = combined.filter((c) => !c.isCustom && c.category === activeCategory)
    }

    // Apply search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      combined = combined.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.includes(q))
      )
    }

    return combined
  }, [activeCategory, search, customCalculators])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold font-mono uppercase mb-4"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              White-labeled Math Engine
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark-900 mb-4"
            >
              All Calculators
            </motion.h1>
            <p className="text-dark-400 max-w-lg mx-auto text-sm mb-6">
              Browse our complete collection of <strong>{calculators.length + customCalculators.length} calculators</strong>, or design your own branding template instantly.
            </p>
            <div className="flex justify-center">
              <Link
                href="/builder"
                className="px-5 py-2.5 text-xs font-mono font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg active:scale-95 transition-all shadow-md shadow-indigo-600/10 flex items-center gap-1.5 uppercase"
              >
                <Plus className="w-4 h-4" />
                Build Custom Calculator
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search calculators..."
                className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-dark-800 focus:outline-none focus:border-dark-300 focus:ring-2 focus:ring-dark-100 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold font-mono rounded-full border transition-all ${
                  activeCategory === cat
                    ? 'bg-dark-800 text-white border-dark-800 shadow-md'
                    : 'bg-white text-dark-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat === 'all' 
                  ? 'ALL' 
                  : cat === 'custom' 
                    ? 'MY CUSTOM' 
                    : CATEGORY_LABELS[cat].toUpperCase()}
                
                {cat === 'all' && (
                  <span className="ml-1.5 text-[10px] opacity-60">
                    ({calculators.length + customCalculators.length})
                  </span>
                )}
                {cat === 'custom' && (
                  <span className="ml-1.5 text-[10px] opacity-60">
                    ({customCalculators.length})
                  </span>
                )}
                {cat !== 'all' && cat !== 'custom' && (
                  <span className="ml-1.5 text-[10px] opacity-60">
                    ({calculators.filter((c) => c.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="text-center mb-6 text-xs font-mono text-dark-400">
            Showing {filtered.length} calculator{filtered.length !== 1 ? 's' : ''}
          </div>

          {/* Calculator Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((calc, i) => {
              const colors = CATEGORY_COLORS[calc.category]
              const targetUrl = calc.isCustom && calc.customConfig
                ? `/calculators/custom#config=${serializeConfig(calc.customConfig)}`
                : `/calculators/${calc.slug}`

              return (
                <motion.div
                  key={calc.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.5) }}
                >
                  <Link
                    href={targetUrl}
                    className="group block p-5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 h-full relative"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${
                        calc.isCustom ? 'bg-indigo-50 text-indigo-600' : `${colors.bg} ${colors.text}`
                      } flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        {calc.isCustom ? <Wrench className="w-5 h-5" /> : <Calculator className="w-5 h-5" />}
                      </div>
                      
                      {calc.isCustom ? (
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] uppercase px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-50 border border-indigo-200 text-indigo-600">
                            Custom
                          </span>
                          <button
                            onClick={(e) => handleDeleteCustom(calc.customConfig!.id, e)}
                            className="p-1 hover:bg-red-50 text-red-500 rounded transition-colors"
                            title="Delete custom calculator"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-mono font-bold ${colors.bg} ${colors.text} ${colors.border} border`}>
                          {CATEGORY_LABELS[calc.category]}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-dark-800 mb-1 group-hover:text-dark-900">{calc.name}</h3>
                    <p className="text-xs text-dark-400 mb-3 line-clamp-2">{calc.description}</p>

                    <div className="flex items-center text-xs font-semibold text-dark-600 group-hover:text-primary-600 transition-colors">
                      {calc.isCustom ? 'Run custom widget' : 'Use Now'}
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Calculator className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 text-sm font-medium">No calculators found for &ldquo;{search}&rdquo;</p>
              <button onClick={() => { setSearch(''); setActiveCategory('all') }} className="mt-3 text-xs font-semibold text-primary-600 hover:text-primary-700">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
