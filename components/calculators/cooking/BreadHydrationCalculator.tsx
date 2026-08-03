'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BreadHydrationCalculator() {
  const [flourStr, setFlourStr] = useState('500') // grams
  const [waterStr, setWaterStr] = useState('350') // grams

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, hydration: 0, steps: [] as string[] }
    const f = parseFloat(flourStr)
    const w = parseFloat(waterStr)
    if (isNaN(f) || isNaN(w) || f <= 0 || w < 0) return { ...defaultObj, error: 'Please enter valid positive weights.' }
    const hydration = (w / f) * 100
    return {
      error: null,
      hydration,
      steps: [
        `Hydration % = (Water Weight / Flour Weight) × 100`,
        `Hydration = (${w} / ${f}) × 100 = ${hydration.toFixed(1)}%`
      ]
    }
  }, [flourStr, waterStr])

  return (
    <FormCalculatorShell title="Bread Dough Hydration Solver" subtitle="Calculate water-flour ratio for bakers" badge="COOKING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Flour Weight (grams)" value={flourStr} onChange={setFlourStr} id="bh-f" />
          <RetroInput label="Water Weight (grams)" value={waterStr} onChange={setWaterStr} id="bh-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Hydration Ratio" value={`${results.hydration.toFixed(1)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
