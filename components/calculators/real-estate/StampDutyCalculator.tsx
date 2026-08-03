'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function StampDutyCalculator() {
  const [priceStr, setPriceStr] = useState('400000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, duty: 0 }
    const p = parseFloat(priceStr)
    if (isNaN(p) || p <= 0) return { ...defaultObj, error: 'Please enter a valid price.' }
    // General rate: 1.5% up to 250k, 3% above
    let duty = 0
    if (p <= 250000) {
      duty = p * 0.015
    } else {
      duty = 3750 + (p - 250000) * 0.03
    }
    return { error: null, duty }
  }, [priceStr])

  return (
    <FormCalculatorShell title="Stamp Duty Tax Solver" subtitle="Calculate government stamp duty fees on home purchases" badge="REAL ESTATE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Purchase Price ($)" value={priceStr} onChange={setPriceStr} id="sd-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Stamp Duty Fee" value={results.duty.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
