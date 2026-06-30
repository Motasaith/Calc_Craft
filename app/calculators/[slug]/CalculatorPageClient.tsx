'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight, ArrowLeft, Calculator } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { WPCalculator } from '@/lib/wp'
import CustomCalculatorRenderer, { CustomCalculatorConfig, CustomComponentConfig } from '@/components/calculators/shared/CustomCalculatorRenderer'
import { getCalculatorComponent } from '@/lib/calculator-components'

export default function CalculatorPageClient({ calc }: { calc: WPCalculator }) {
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
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-dark-900 mb-2" dangerouslySetInnerHTML={{ __html: calc.title.rendered }} />
              </div>

              {/* Calculator Component */}
              <div className="mb-8">
                {ReactComponent && <ReactComponent />}
                {!ReactComponent && config && <CustomCalculatorRenderer config={config} />}
              </div>
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
      <Footer />
    </>
  )
}
