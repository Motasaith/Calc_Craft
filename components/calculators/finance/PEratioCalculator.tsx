'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PEratioCalculator() {
  const [priceStr, setPriceStr] = useState('150')
  const [epsStr, setEpsStr] = useState('7.50')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, pe: 0 }
    const p = parseFloat(priceStr)
    const eps = parseFloat(epsStr)

    if (isNaN(p) || isNaN(eps) || p <= 0 || eps === 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const pe = p / eps
    return { error: null, pe }
  }, [priceStr, epsStr])

  return (
    <FormCalculatorShell title="Price-to-Earnings Ratio Solver" subtitle="Calculate stock valuation metrics from EPS factors" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Share Price ($)" value={priceStr} onChange={setPriceStr} id="pe-p" />
          <RetroInput label="Earnings per Share (EPS, $)" value={epsStr} onChange={setEpsStr} id="pe-e" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="P/E Ratio" value={results.pe.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
