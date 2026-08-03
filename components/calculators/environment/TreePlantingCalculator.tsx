'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TreePlantingCalculator() {
  const [treesStr, setTreesStr] = useState('5')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, co2Offset: 0 }
    const t = parseInt(treesStr)
    if (isNaN(t) || t < 0) return { ...defaultObj, error: 'Please enter a valid tree count.' }
    // Average mature tree absorbs 48 lbs CO2 per year
    const co2Offset = t * 48
    return { error: null, co2Offset }
  }, [treesStr])

  return (
    <FormCalculatorShell title="Tree CO₂ Absorption Solver" subtitle="Estimate carbon absorption equivalents of newly planted trees" badge="ENVIRONMENT">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Number of Trees" value={treesStr} onChange={setTreesStr} id="tp-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Annual CO₂ Offset (lbs/yr)" value={results.co2Offset.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
