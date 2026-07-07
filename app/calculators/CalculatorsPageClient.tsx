'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  Search,
  ArrowRight,
  Wrench,
  Trash2,
  Plus,
  Sparkles,
  Grid3x3,
  LayoutGrid,
  List as ListIcon,
  X,
  Star,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  calculators,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type CalculatorCategory,
} from '@/lib/calculators'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { serializeConfig } from '@/lib/url-serializer'
import { CustomCalculatorConfig } from '@/components/calculators/shared/CustomCalculatorRenderer'

import type { WPCalculator } from '@/lib/wp'

type CategoryFilter = CalculatorCategory | 'all' | 'custom'
type ViewMode = 'grid' | 'list'

export default function CalculatorsPageClient({ wpCalculators = [] }: { wpCalculators?: WPCalculator[] }) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewMode>('grid')
  const [customCalculators, setCustomCalculators] = useState<CustomCalculatorConfig[]>([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(50)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, search, itemsPerPage])

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
    const standardCats: CategoryFilter[] = ['math', 'finance', 'health', 'date-time', 'conversion', 'everyday', 'islamic', 'construction', 'engineering', 'geometry', 'statistics', 'trigonometry', 'physics', 'chemistry', 'astronomy', 'agriculture', 'photography', 'environment', 'real-estate', 'tax', 'automotive', 'sports', 'cooking', 'education', 'business', 'science', 'landscaping', 'plumbing', 'electrical', 'misc']
    return [...list, ...standardCats]
  }, [customCalculators])

  // Base combined list of all WP and custom calculators
  const allCalculators = useMemo(() => {
    let standardList = wpCalculators.map((wpCalc) => {
      const staticData = calculators.find((c) => c.slug === wpCalc.slug)
      return {
        slug: wpCalc.slug,
        name: wpCalc.title.rendered,
        shortName: wpCalc.acf?.brand_name || wpCalc.title.rendered,
        category: staticData?.category || 'misc',
        description: staticData?.description || 'Use this free online calculator.',
        keywords: staticData?.keywords || [wpCalc.slug.replace('-', ' ')],
        mode: staticData?.mode || 'form',
        icon: staticData?.icon || 'Calculator',
        isCustom: false,
        customConfig: null as CustomCalculatorConfig | null,
      }
    })

    let customList = customCalculators.map((c) => ({
      slug: `custom-${c.id}`,
      name: c.name,
      shortName: c.brandName || 'Custom',
      category: 'everyday' as CalculatorCategory,
      description: c.description,
      keywords: [c.name.toLowerCase(), 'custom calculator'],
      mode: 'form' as const,
      icon: 'Wrench',
      isCustom: true,
      customConfig: c,
    }))

    return [...standardList, ...customList]
  }, [wpCalculators, customCalculators])

  // Filtered calculators
  const filtered = useMemo(() => {
    let combined = [...allCalculators]

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
  }, [allCalculators, activeCategory, search])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  
  const paginatedCalculators = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filtered.slice(start, start + itemsPerPage)
  }, [filtered, currentPage, itemsPerPage])

  const totalCount = allCalculators.length

  // Category meta for the chips
  const categoryMeta: Record<CategoryFilter, { dot: string; gradient: string }> = {
    all: { dot: 'bg-dark-700', gradient: 'from-dark-700 to-dark-900' },
    custom: { dot: 'bg-indigo-500', gradient: 'from-indigo-500 to-violet-500' },
    math: { dot: 'bg-blue-500', gradient: 'from-blue-500 to-cyan-500' },
    finance: { dot: 'bg-amber-500', gradient: 'from-amber-500 to-orange-500' },
    health: { dot: 'bg-rose-500', gradient: 'from-rose-500 to-pink-500' },
    'date-time': { dot: 'bg-cyan-500', gradient: 'from-cyan-500 to-teal-500' },
    conversion: { dot: 'bg-emerald-500', gradient: 'from-emerald-500 to-green-500' },
    everyday: { dot: 'bg-purple-500', gradient: 'from-purple-500 to-fuchsia-500' },
    islamic: { dot: 'bg-teal-500', gradient: 'from-teal-500 to-emerald-500' },
    construction: { dot: 'bg-orange-500', gradient: 'from-orange-500 to-amber-500' },
    engineering: { dot: 'bg-indigo-500', gradient: 'from-indigo-500 to-blue-500' },
    geometry: { dot: 'bg-lime-500', gradient: 'from-lime-500 to-green-500' },
    statistics: { dot: 'bg-sky-500', gradient: 'from-sky-500 to-cyan-500' },
    trigonometry: { dot: 'bg-fuchsia-500', gradient: 'from-fuchsia-500 to-pink-500' },
    physics: { dot: 'bg-violet-500', gradient: 'from-violet-500 to-purple-500' },
    chemistry: { dot: 'bg-green-500', gradient: 'from-green-500 to-emerald-500' },
    astronomy: { dot: 'bg-indigo-500', gradient: 'from-indigo-500 to-violet-500' },
    agriculture: { dot: 'bg-lime-500', gradient: 'from-lime-500 to-green-500' },
    photography: { dot: 'bg-stone-500', gradient: 'from-stone-500 to-neutral-500' },
    environment: { dot: 'bg-emerald-500', gradient: 'from-emerald-500 to-teal-500' },
    'real-estate': { dot: 'bg-amber-500', gradient: 'from-amber-500 to-yellow-500' },
    tax: { dot: 'bg-red-500', gradient: 'from-red-500 to-rose-500' },
    automotive: { dot: 'bg-zinc-500', gradient: 'from-zinc-500 to-slate-500' },
    sports: { dot: 'bg-orange-500', gradient: 'from-orange-500 to-red-500' },
    cooking: { dot: 'bg-yellow-500', gradient: 'from-yellow-500 to-amber-500' },
    education: { dot: 'bg-blue-500', gradient: 'from-blue-500 to-indigo-500' },
    business: { dot: 'bg-slate-500', gradient: 'from-slate-500 to-gray-500' },
    science: { dot: 'bg-teal-500', gradient: 'from-teal-500 to-cyan-500' },
    landscaping: { dot: 'bg-green-500', gradient: 'from-green-500 to-lime-500' },
    plumbing: { dot: 'bg-cyan-500', gradient: 'from-cyan-500 to-blue-500' },
    electrical: { dot: 'bg-amber-500', gradient: 'from-amber-500 to-orange-500' },
    misc: { dot: 'bg-slate-500', gradient: 'from-slate-500 to-gray-500' },
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24 px-4 sm:px-6 bg-gradient-to-b from-white via-neutral-50/50 to-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-radial from-indigo-100/40 via-transparent to-transparent blur-3xl" />
          <div className="absolute top-40 -left-32 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
          <div className="absolute top-80 -right-32 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* ─────────────────── Hero ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold font-mono uppercase tracking-wider mb-5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              White-labeled Math Engine
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-dark-900 mb-5 leading-[1.05]">
              The complete
              <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                calculator library
              </span>
            </h1>

            <p className="text-base sm:text-lg text-dark-500 leading-relaxed mb-8 max-w-2xl mx-auto">
              {totalCount} precision calculators for math, finance, health, and everyday life,
              all powered by a single BigNumber engine. No signup, no clutter, instant answers.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/builder"
                className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-dark-800 to-dark-900 hover:from-dark-900 hover:to-black rounded-xl active:scale-95 transition-all shadow-lg shadow-dark-900/20"
              >
                <Plus className="w-4 h-4" />
                Build Custom Calculator
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#all-calculators"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-dark-700 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 rounded-xl active:scale-95 transition-all shadow-sm"
              >
                <LayoutGrid className="w-4 h-4" />
                Browse Library
              </a>
            </div>
          </motion.div>

          {/* ─────────────────── Quick stats ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-12"
          >
            {[
              { label: 'Calculators', value: totalCount, icon: Calculator, color: 'text-indigo-600 bg-indigo-50' },
              { label: 'Categories', value: 6, icon: Grid3x3, color: 'text-amber-600 bg-amber-50' },
              { label: 'Precision', value: '128-bit', icon: Zap, color: 'text-rose-600 bg-rose-50' },
              { label: 'Always Free', value: '100%', icon: Star, color: 'text-emerald-600 bg-emerald-50' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-3.5 bg-white border border-neutral-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-neutral-300 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-extrabold text-dark-900 leading-none">{stat.value}</div>
                  <div className="text-[10px] font-bold text-dark-500 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* ─────────────────── Sticky filter bar ─────────────────── */}
          <div id="all-calculators" className="sticky top-20 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-xl border-y border-neutral-200/60 shadow-sm mb-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search calculators..."
                  className="w-full h-10 pl-10 pr-9 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-dark-800 placeholder:text-neutral-400 focus:outline-none focus:border-dark-300 focus:ring-2 focus:ring-dark-100 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded-md transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5 text-neutral-500" />
                  </button>
                )}
              </div>

              {/* View toggle */}
              <div className="hidden md:flex items-center gap-1 p-1 bg-neutral-100 rounded-xl">
                <button
                  onClick={() => setView('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    view === 'grid' ? 'bg-white shadow-sm text-dark-900' : 'text-dark-500 hover:text-dark-700'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded-lg transition-all ${
                    view === 'list' ? 'bg-white shadow-sm text-dark-900' : 'text-dark-500 hover:text-dark-700'
                  }`}
                  title="List view"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category chips */}
            <div className="max-w-7xl mx-auto mt-3 -mb-3 pb-1">
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                {categoriesList.map((cat) => {
                  const isActive = activeCategory === cat
                  const count =
                    cat === 'all'
                      ? totalCount
                      : cat === 'custom'
                        ? customCalculators.length
                        : allCalculators.filter((c) => !c.isCustom && c.category === cat).length
                  const meta = categoryMeta[cat]
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`group relative flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold font-mono uppercase tracking-wide rounded-full border whitespace-nowrap transition-all ${
                        isActive
                           ? 'text-white border-transparent shadow-md'
                          : 'bg-white text-dark-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {isActive && (
                        <span className={`absolute inset-0 rounded-full bg-gradient-to-r ${meta.gradient} -z-10`} />
                      )}
                      {!isActive && cat !== 'all' && cat !== 'custom' && (
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      )}
                      {!isActive && cat === 'custom' && (
                        <Wrench className="w-3 h-3" />
                      )}
                      {cat === 'all'
                        ? 'All'
                        : cat === 'custom'
                          ? 'My Custom'
                          : CATEGORY_LABELS[cat]}
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-dark-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ─────────────────── Results count ─────────────────── */}
          <div className="flex items-center justify-between mb-5 text-xs font-mono">
            <div className="text-dark-500">
              {filtered.length > 0 ? (
                <>
                  Showing <span className="font-bold text-dark-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-dark-900">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="font-bold text-dark-900">{filtered.length}</span> calculator{filtered.length !== 1 ? 's' : ''}
                </>
              ) : (
                <><span className="font-bold text-dark-900">0</span> calculators</>
              )}
              {activeCategory !== 'all' && (
                <span> in <span className="font-bold text-dark-700">{activeCategory === 'custom' ? 'My Custom' : CATEGORY_LABELS[activeCategory]}</span></span>
              )}
            </div>
            {(search || activeCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearch('')
                  setActiveCategory('all')
                }}
                className="inline-flex items-center gap-1 text-dark-500 hover:text-dark-900 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </div>

          {/* ─────────────────── Grid view ─────────────────── */}
          {view === 'grid' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {paginatedCalculators.map((calc, i) => {
                  const colors = CATEGORY_COLORS[calc.category]
                  const meta = categoryMeta[calc.category]
                  const targetUrl =
                    calc.isCustom && calc.customConfig
                      ? `/calculators/custom#config=${serializeConfig(calc.customConfig)}`
                      : `/calculators/${calc.slug}`

                  return (
                    <motion.div
                      key={calc.slug}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(i * 0.025, 0.4), duration: 0.3 }}
                    >
                      <Link
                        href={targetUrl}
                        className="group relative block p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-neutral-300 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-full overflow-hidden"
                      >
                        {/* Top gradient bar */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                            calc.isCustom ? 'from-indigo-500 to-violet-500' : meta.gradient
                          } opacity-80 group-hover:opacity-100 transition-opacity`}
                        />

                        {/* Subtle glow on hover */}
                        <div
                          className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${
                            calc.isCustom ? 'from-indigo-500/20' : meta.gradient
                          } to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity`}
                        />

                        <div className="relative">
                          <div className="flex items-start justify-between mb-4">
                            <div
                              className={`w-11 h-11 rounded-xl ${
                                calc.isCustom
                                  ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white'
                                  : `${colors.bg} ${colors.text}`
                              } flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}
                            >
                              {calc.isCustom ? (
                                <Wrench className="w-5 h-5" />
                              ) : (
                                <Calculator className="w-5 h-5" />
                              )}
                            </div>

                            {calc.isCustom ? (
                              <div className="flex items-center gap-1">
                                <span className="text-[9px] uppercase px-2 py-0.5 rounded-full font-mono font-bold bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 text-indigo-700">
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
                              <span
                                className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-mono font-bold ${colors.bg} ${colors.text} ${colors.border} border`}
                              >
                                {CATEGORY_LABELS[calc.category]}
                              </span>
                            )}
                          </div>

                          <h3 className="text-[15px] font-bold text-dark-900 mb-1.5 group-hover:text-dark-900 leading-tight">
                            {calc.name}
                          </h3>
                          <p className="text-xs text-dark-500 mb-4 line-clamp-2 leading-relaxed">
                            {calc.description}
                          </p>

                          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                            <div className="flex items-center text-xs font-bold text-dark-600 group-hover:text-dark-900 transition-colors">
                              {calc.isCustom ? 'Run widget' : 'Open calculator'}
                              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                            {!calc.isCustom && (
                              <span
                                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  calc.mode === 'retro' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                                }`}
                              >
                                {calc.mode === 'retro' ? 'LCD' : 'FORM'}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}

          {/* ─────────────────── List view ─────────────────── */}
          {view === 'list' && (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {paginatedCalculators.map((calc, i) => {
                  const colors = CATEGORY_COLORS[calc.category]
                  const targetUrl =
                    calc.isCustom && calc.customConfig
                      ? `/calculators/custom#config=${serializeConfig(calc.customConfig)}`
                      : `/calculators/${calc.slug}`

                  return (
                    <motion.div
                      key={calc.slug}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    >
                      <Link
                        href={targetUrl}
                        className="group flex items-center gap-4 p-4 bg-white border border-neutral-200/80 hover:border-neutral-300 hover:shadow-md rounded-2xl transition-all"
                      >
                        <div
                          className={`w-12 h-12 shrink-0 rounded-xl ${
                            calc.isCustom
                              ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white'
                              : `${colors.bg} ${colors.text}`
                          } flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          {calc.isCustom ? <Wrench className="w-5 h-5" /> : <Calculator className="w-5 h-5" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-bold text-dark-900 truncate">{calc.name}</h3>
                            {calc.isCustom ? (
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Custom
                              </span>
                            ) : (
                              <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold ${colors.bg} ${colors.text}`}>
                                {CATEGORY_LABELS[calc.category]}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-dark-500 line-clamp-1">{calc.description}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {calc.isCustom && (
                            <button
                              onClick={(e) => handleDeleteCustom(calc.customConfig!.id, e)}
                              className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <ArrowRight className="w-4 h-4 text-dark-400 group-hover:text-dark-900 group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}

          {/* ─────────────────── Pagination Controls ─────────────────── */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-white/80 backdrop-blur border border-neutral-200 p-3 sm:p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-dark-500">
                <span>ITEMS PER PAGE:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1 text-dark-900 focus:outline-none focus:border-indigo-400 cursor-pointer"
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-neutral-200 bg-white text-dark-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1 px-1 sm:px-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5) {
                      if (currentPage > 3) {
                        pageNum = currentPage - 2 + i;
                      }
                      if (currentPage > totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      }
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                          currentPage === pageNum 
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                            : 'text-dark-600 hover:bg-neutral-100 hover:text-dark-900'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-neutral-200 bg-white text-dark-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────── Empty state ─────────────────── */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 px-6 bg-white border border-dashed border-neutral-300 rounded-3xl"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                <Search className="w-7 h-7 text-neutral-400" />
              </div>
              <h3 className="text-lg font-bold text-dark-900 mb-1">No calculators found</h3>
              <p className="text-sm text-dark-500 mb-5 max-w-md mx-auto">
                {search
                  ? `We couldn't find anything matching "${search}" in ${
                      activeCategory === 'all' ? 'any category' : activeCategory === 'custom' ? 'your custom calculators' : CATEGORY_LABELS[activeCategory]
                    }.`
                  : 'No calculators in this category yet.'}
              </p>
              <button
                onClick={() => {
                  setSearch('')
                  setActiveCategory('all')
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-dark-800 hover:bg-dark-900 rounded-lg active:scale-95 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Clear filters
              </button>
            </motion.div>
          )}

          {/* ─────────────────── Footer CTA ─────────────────── */}
          {filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark-900 via-dark-800 to-black p-8 sm:p-10 text-white"
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-500 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-fuchsia-500 rounded-full blur-3xl" />
              </div>

              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold font-mono uppercase tracking-wider mb-3">
                    <Wrench className="w-3 h-3" />
                    Custom builder
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mb-2">Need something specific?</h3>
                  <p className="text-sm text-white/70 max-w-md">
                    Build your own branded calculator in minutes. Pick fields, write a formula, share a URL.
                  </p>
                </div>
                <Link
                  href="/builder"
                  className="group inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-dark-900 bg-white hover:bg-neutral-100 rounded-xl active:scale-95 transition-all shadow-lg shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Build yours
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
