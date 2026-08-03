'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DepreciationCalculator() {
  const [costStr, setCostStr] = useState('20000')
  const [salvageStr, setSalvageStr] = useState('5000')
  const [lifeStr, setLifeStr] = useState('5') // years

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, annualDepreciation: 0 }
    const c = parseFloat(costStr)
    const s = parseFloat(salvageStr)
    const l = parseFloat(lifeStr)

    if (isNaN(c) || isNaN(s) || isNaN(l) || c <= 0 || s < 0 || l <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    if (c <= s) return { ...defaultObj, error: 'Cost must exceed salvage value.' }
    const annualDepreciation = (c - s) / l
    return { error: null, annualDepreciation }
  }, [costStr, salvageStr, lifeStr])

  return (
    <FormCalculatorShell title="Straight-Line Depreciation Solver" subtitle="Calculate asset depreciation expense per year" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Asset Purchase Cost ($)" value={costStr} onChange={setCostStr} id="depr-c" />
          <RetroInput label="Asset Salvage Value ($)" value={salvageStr} onChange={setSalvageStr} id="depr-s" />
          <RetroInput label="Useful Life (Years)" value={lifeStr} onChange={setLifeStr} id="depr-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Annual Depreciation" value={results.annualDepreciation.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
