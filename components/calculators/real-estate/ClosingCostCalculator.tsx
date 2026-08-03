'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ClosingCostCalculator() {
  const [priceStr, setPriceStr] = useState('300000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, low: 0, high: 0 }
    const p = parseFloat(priceStr)
    if (isNaN(p) || p <= 0) return { ...defaultObj, error: 'Please enter a valid price.' }
    // General rule: closing costs range between 2% and 5% of price
    const low = p * 0.02
    const high = p * 0.05
    return { error: null, low, high }
  }, [priceStr])

  return (
    <FormCalculatorShell title="Home Closing Cost Solver" subtitle="Estimate typical buyer closing costs (2% to 5% range)" badge="REAL ESTATE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Property Purchase Price ($)" value={priceStr} onChange={setPriceStr} id="cc-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Min Closing Costs (2%)" value={results.low.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
              <ResultDisplay label="Max Closing Costs (5%)" value={results.high.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
