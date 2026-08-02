'use client'

/**
 * Renders a catalogue calculator inside an iframe on someone else's site.
 *
 * Previously this took a WPCalculator and reconstructed a CustomCalculatorConfig
 * out of ACF fields (input_1_name … input_5_name, math_formula, formula_2).
 * Those calculators are real React components in the local registry, so the
 * reconstruction only ever produced a degraded five-input approximation of them.
 * Now it renders the actual component.
 *
 * User-built calculators are a separate route — /embed/c?id=<publicId> — served
 * from the database.
 */

import React, { useEffect } from 'react'
import { getCalculatorComponent } from '@/lib/calculator-components'

export default function EmbedSlugClient({ slug, name }: { slug: string; name: string }) {
  useEffect(() => {
    // Iframe hygiene — no scrollbars, no margin, inherit the host's backdrop.
    document.body.style.overflow = 'auto'
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.backgroundColor = 'transparent'
  }, [])

  const CalculatorComponent = getCalculatorComponent(slug)

  return (
    <div className="w-full min-h-screen p-2 flex items-start justify-center bg-transparent">
      <div className="w-full max-w-xl mx-auto py-1">
        {CalculatorComponent ? (
          <CalculatorComponent />
        ) : (
          <div className="text-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h1 className="text-base font-bold text-dark-800">{name}</h1>
            <p className="text-sm text-dark-500 mt-2">
              This calculator is not available as an embed yet.
            </p>
            <a
              href={`https://homeofcalculators.com/calculators/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-xs font-bold text-primary-700 hover:underline"
            >
              Open it on Home of Calculators
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
