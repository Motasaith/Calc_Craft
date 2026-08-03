'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DiscountCalculator() {
  const [originalPriceStr, setOriginalPriceStr] = useState('100')
  const [discountPercentStr, setDiscountPercentStr] = useState('20')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, salePrice: 0, savings: 0, steps: [] as string[] }
    const original = parseFloat(originalPriceStr)
    const discount = parseFloat(discountPercentStr)
    if (isNaN(original) || isNaN(discount) || original < 0 || discount < 0 || discount > 100) {
      return { ...defaultObj, error: 'Please enter a valid original price and discount percentage (0-100).' }
    }
    const savings = original * (discount / 100)
    const salePrice = original - savings
    return {
      error: null,
      salePrice,
      savings,
      steps: [
        `Savings = Original Price × (Discount% / 100) = $${original} × (${discount}/100) = $${savings.toFixed(2)}`,
        `Sale Price = Original Price - Savings = $${original} - $${savings.toFixed(2)} = $${salePrice.toFixed(2)}`
      ]
    }
  }, [originalPriceStr, discountPercentStr])

  return (
    <FormCalculatorShell title="Discount Calculator" subtitle="Solve sale prices and total savings from percentage discounts" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Original Price ($)" value={originalPriceStr} onChange={setOriginalPriceStr} id="disc-o" />
          <RetroInput label="Discount (%)" value={discountPercentStr} onChange={setDiscountPercentStr} id="disc-d" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Sale Price" value={results.salePrice.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
                <ResultDisplay label="Total Savings" value={results.savings.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
