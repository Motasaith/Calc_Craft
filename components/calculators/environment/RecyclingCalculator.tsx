'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RecyclingCalculator() {
  const [paperStr, setPaperStr] = useState('50') // lbs

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, co2Saved: 0 }
    const p = parseFloat(paperStr)
    if (isNaN(p) || p < 0) return { ...defaultObj, error: 'Please enter valid weights.' }
    // Assume 1 lb paper recycled saves 1.2 lbs CO2
    const co2Saved = p * 1.2
    return { error: null, co2Saved }
  }, [paperStr])

  return (
    <FormCalculatorShell title="Recycling Carbon Offset Solver" subtitle="Estimate carbon emissions saved through recycling paper materials" badge="ENVIRONMENT">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Recycled Paper (lbs)" value={paperStr} onChange={setPaperStr} id="rc-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="CO₂ Saved (lbs)" value={results.co2Saved.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
