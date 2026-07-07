'use client'

import React, { useEffect, useMemo } from 'react'
import { WPCalculator } from '@/lib/wp'
import CustomCalculatorRenderer, { CustomCalculatorConfig, CustomComponentConfig } from '@/components/calculators/shared/CustomCalculatorRenderer'
import { getCalculatorComponent } from '@/lib/calculator-components'

export default function EmbedSlugClient({ calc }: { calc: WPCalculator }) {
  useEffect(() => {
    // Hide scrollbars on body for clean iframe containment
    document.body.style.overflow = 'auto'
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.backgroundColor = 'transparent'
  }, [])

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
    <div className="w-full min-h-screen p-2 flex items-start justify-center bg-transparent">
      <div className="w-full max-w-xl mx-auto py-1">
        {ReactComponent && <ReactComponent />}
        {!ReactComponent && config && <CustomCalculatorRenderer config={config} isPreview={false} />}
      </div>
    </div>
  )
}
