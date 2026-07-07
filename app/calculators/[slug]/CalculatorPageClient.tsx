'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, ArrowLeft, Calculator, Code2, Copy, CheckCircle2, X, Bookmark } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CalculatorSEOContent from '@/components/CalculatorSEOContent'
import { WPCalculator } from '@/lib/wp'
import { getCalculatorBySlug } from '@/lib/calculators'
import CustomCalculatorRenderer, { CustomCalculatorConfig, CustomComponentConfig } from '@/components/calculators/shared/CustomCalculatorRenderer'
import { getCalculatorComponent } from '@/lib/calculator-components'
import { useUserData } from '@/components/providers/UserDataContext'
import { useAuth } from '@/components/providers/AuthContext'

export default function CalculatorPageClient({ calc }: { calc: WPCalculator }) {
  const { savedCalculators, addSavedCalculator, removeSavedCalculator, addEmbeddedCalculator } = useUserData()
  const { user, setAuthModalOpen, setAuthModalTab } = useAuth()
  
  const [showEmbedModal, setShowEmbedModal] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const isBookmarked = savedCalculators.includes(calc.slug)

  const handleBookmark = () => {
    if (!user) {
      setAuthModalTab('login')
      setAuthModalOpen(true)
      return
    }

    if (isBookmarked) {
      removeSavedCalculator(calc.slug)
    } else {
      addSavedCalculator(calc.slug)
    }
  }

  const handleCopyEmbed = () => {
    const embedUrl = `https://homeofcalculators.com/embed/${calc.slug}`
    const iframeCode = `<iframe src="${embedUrl}" width="100%" height="500" frameborder="0" loading="lazy" sandbox="allow-scripts allow-same-origin" style="border-radius:12px;overflow:hidden;"></iframe>`
    navigator.clipboard.writeText(iframeCode)
    setCopied(true)
    addEmbeddedCalculator({ id: calc.slug, name: calc.title.rendered, isCustom: false, embeddedAt: new Date().toISOString() })
    setTimeout(() => setCopied(false), 2000)
  }

  // Get local registry data for SEO content (fallback if WP content is empty)
  const localCalc = getCalculatorBySlug(calc.slug)
  // If it's a React component, grab it
  const ReactComponent = calc.acf.calculator_type === 'react' && calc.acf.react_component_id
    ? getCalculatorComponent(calc.acf.react_component_id)
    : null

  // If it's a simple ACF calculator, map it to the CustomCalculatorConfig
  const config = useMemo(() => {
    if (calc.acf.calculator_type === 'react') return null

    const components: CustomComponentConfig[] = []
    
    // Dynamically build components from ACF fields
    for (let i = 1; i <= 5; i++) {
      const nameKey = `input_${i}_name` as keyof typeof calc.acf
      const typeKey = `input_${i}_type` as keyof typeof calc.acf
      
      if (calc.acf[nameKey]) {
        components.push({
          id: `input_${i}`,
          name: nameKey,
          label: String(calc.acf[nameKey]),
          type: (calc.acf[typeKey] as any) || 'number',
        })
      }
    }

    const formulas = []
    if (calc.acf.math_formula) {
      formulas.push({
        id: 'f1',
        label: 'Result',
        formula: calc.acf.math_formula,
        decimalPlaces: 2
      })
    }
    if (calc.acf.formula_2) {
      formulas.push({
        id: 'f2',
        label: 'Result 2',
        formula: calc.acf.formula_2,
        decimalPlaces: 2
      })
    }

    const allowedThemes = ['retro', 'dark', 'modern', 'pastel', 'cyberpunk', 'custom'];
    const validTheme = allowedThemes.includes(calc.acf.theme) ? calc.acf.theme : 'modern';

    const c: CustomCalculatorConfig = {
      id: String(calc.id),
      name: calc.title.rendered,
      brandName: calc.acf.brand_name || 'Home of Calculators',
      description: '',
      theme: validTheme as any,
      layout: (calc.acf.layout as any) || 'standard',
      requireSubmit: calc.acf.require_submit || false,
      components,
      formulas,
    }
    return c
  }, [calc])

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
            <span className="text-dark-700 font-semibold">{calc.title.rendered}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 lg:gap-8">
            {/* Main Calculator Area */}
            <div>
              {/* Page Header */}
              <div className="mb-6 flex items-start justify-between gap-4">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-dark-900 mb-2" dangerouslySetInnerHTML={{ __html: calc.title.rendered }} />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBookmark}
                    className={`flex items-center gap-1.5 px-3 py-1.5 mt-1 rounded-lg border transition-colors text-sm font-bold shrink-0 shadow-sm ${
                      isBookmarked 
                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200' 
                        : 'bg-white text-dark-600 hover:bg-neutral-50 border-neutral-200'
                    }`}
                    title={isBookmarked ? "Remove from Library" : "Save to Library"}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                  <button
                    onClick={() => setShowEmbedModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 mt-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors text-sm font-bold shrink-0 shadow-sm"
                  >
                    <Code2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Embed</span>
                  </button>
                </div>
              </div>

              {/* Calculator Component */}
              <div className="mb-8">
                {ReactComponent && <ReactComponent />}
                {!ReactComponent && config && <CustomCalculatorRenderer config={config} />}
              </div>

              {/* Educational Article/Content from WordPress */}
              {calc.content?.rendered && (
                <div 
                  className="rich-text-content mt-12 pt-8 border-t border-gray-200 font-sans text-dark-800"
                  dangerouslySetInnerHTML={{ __html: calc.content.rendered }}
                />
              )}

              {/* SEO Educational Content — formula reference, how-to, FAQ */}
              {localCalc && (
                <CalculatorSEOContent
                  slug={calc.slug}
                  calc={{
                    name: localCalc.name,
                    shortName: localCalc.shortName,
                    description: localCalc.description,
                    category: localCalc.category,
                    keywords: localCalc.keywords,
                  }}
                />
              )}
            </div>

            {/* Sidebar Placeholder */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <Link
                  href="/calculators"
                  className="flex items-center justify-center gap-2 mt-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-dark-600 hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> All Calculators
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Embed Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-neutral-200">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-neutral-50/50">
              <div className="flex items-center gap-2 text-dark-900 font-bold">
                <Code2 className="w-5 h-5 text-emerald-500" />
                Embed Calculator
              </div>
              <button 
                onClick={() => setShowEmbedModal(false)}
                className="p-1 text-neutral-400 hover:text-dark-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-sm text-dark-500 leading-relaxed">
                Copy and paste the code below into your website's HTML to embed the <strong dangerouslySetInnerHTML={{ __html: calc.title.rendered }} />. It's completely free and responsive.
              </p>
              
              <div className="relative">
                <pre className="p-4 bg-neutral-900 text-neutral-100 rounded-xl text-xs font-mono overflow-x-auto border border-neutral-800 whitespace-pre-wrap word-break">
                  {`<iframe src="https://homeofcalculators.com/embed/${calc.slug}" width="100%" height="500" frameborder="0" loading="lazy" sandbox="allow-scripts allow-same-origin" style="border-radius:12px;overflow:hidden;"></iframe>`}
                </pre>
                <button
                  onClick={handleCopyEmbed}
                  className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm"
                  title="Copy code"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              
              {copied && (
                <div className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Copied to clipboard!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
