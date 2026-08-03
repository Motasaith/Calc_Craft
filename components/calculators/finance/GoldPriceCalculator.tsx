'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GoldPriceCalculator() {
  const [weightStr, setWeightStr] = useState('1') // ounces
  const [purityStr, setPurityStr] = useState('24') // karats

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, value: 0 }
    const w = parseFloat(weightStr)
    const k = parseFloat(purityStr)

    if (isNaN(w) || isNaN(k) || w <= 0 || k <= 0 || k > 24) {
      return { ...defaultObj, error: 'Please enter valid parameters (max 24 Karats).' }
    }

    // Assume fixed reference gold spot rate of $2400 per ounce
    const spot = 2400
    const value = w * (k / 24) * spot
    return { error: null, value }
  }, [weightStr, purityStr])

  return (
    <FormCalculatorShell title="Gold Valuation Karat Solver" subtitle="Estimate gold market value based on weight and karat purity" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Gold Weight (Ounces)" value={weightStr} onChange={setWeightStr} id="gp-w" />
          <RetroInput label="Karat Purity (K, 1-24)" value={purityStr} onChange={setPurityStr} id="gp-k" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Market Value" value={results.value.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
