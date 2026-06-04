'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, ArrowLeft, Calculator } from 'lucide-react'
import { getCalculatorBySlug, getCalculatorsByCategory, CATEGORY_LABELS, CATEGORY_COLORS, type CalculatorEntry } from '@/lib/calculators'
import { getCalculatorComponent } from '@/lib/calculator-components'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function CalculatorPageClient({ slug }: { slug: string }) {
  const calc = getCalculatorBySlug(slug)
  const CalculatorComponent = getCalculatorComponent(slug)

  if (!calc || !CalculatorComponent) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-20 px-4 text-center">
          <Calculator className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark-800 mb-2">Calculator Not Found</h1>
          <p className="text-dark-400 mb-6">The calculator you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/calculators" className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark-800 text-white text-sm font-bold rounded-full hover:bg-dark-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Browse All Calculators
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  const related = getCalculatorsByCategory(calc.category).filter((c) => c.slug !== slug).slice(0, 6)
  const colors = CATEGORY_COLORS[calc.category]

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-dark-400 mb-6 font-medium">
            <Link href="/" className="hover:text-dark-700 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/calculators" className="hover:text-dark-700 transition-colors">Calculators</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/calculators?category=${calc.category}`} className="hover:text-dark-700 transition-colors">
              {CATEGORY_LABELS[calc.category]}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-dark-700 font-semibold">{calc.shortName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 lg:gap-8">
            {/* Main Calculator Area */}
            <div>
              {/* Page Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-mono font-bold ${colors.bg} ${colors.text} ${colors.border} border`}>
                    {CATEGORY_LABELS[calc.category]}
                  </span>
                  {calc.mode === 'retro' && (
                    <span className="text-[9px] uppercase px-2 py-0.5 rounded-full font-mono font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                      ⌨ Keyboard Enabled
                    </span>
                  )}
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-dark-900 mb-2">{calc.name}</h1>
                <p className="text-sm text-dark-400">{calc.description}</p>
              </div>

              {/* Calculator Component */}
              <div className="mb-8">
                <CalculatorComponent />
              </div>
            </div>

            {/* Sidebar — Related Calculators */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <h3 className="text-xs font-extrabold text-dark-800 uppercase tracking-wider font-mono mb-4">
                  Related Calculators
                </h3>
                <div className="space-y-2">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/calculators/${r.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                    >
                      <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-dark-800 truncate">{r.shortName}</div>
                        <div className="text-[10px] text-dark-400 truncate">{r.description.slice(0, 50)}...</div>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/calculators"
                  className="flex items-center justify-center gap-2 mt-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-dark-600 hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> All Calculators
                </Link>
              </div>
            </aside>
          </div>

          {/* Mobile back link */}
          <div className="lg:hidden mt-6">
            <Link
              href="/calculators"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-dark-600 hover:bg-gray-50 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All Calculators
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
