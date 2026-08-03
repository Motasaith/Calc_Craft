'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WaistToHeightCalculator() {
  const [waistStr, setWaistStr] = useState('32') // inches
  const [heightStr, setHeightStr] = useState('70') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, wthr: 0 }
    const w = parseFloat(waistStr)
    const h = parseFloat(heightStr)

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const wthr = w / h
    return { error: null, wthr }
  }, [waistStr, heightStr])

  return (
    <FormCalculatorShell title="Waist-to-Height Ratio Solver" subtitle="Calculate your waist-to-height index ratio for cardiovascular health checks" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Waist Size (inches)" value={waistStr} onChange={setWaistStr} id="wth-w" />
          <RetroInput label="Height Size (inches)" value={heightStr} onChange={setHeightStr} id="wth-h" />
        </div>
        <div className="min-h-[440px] space-y-4 text-center">
          {!results.error ? (
            <div className="space-y-4">
              <ResultDisplay label="Waist-to-Height Ratio (WtHR)" value={results.wthr.toFixed(3)} large />
              <p className="font-mono text-xs text-neutral-600 bg-neutral-50 p-4 rounded border border-neutral-300">
                A ratio of 0.5 or less is typically associated with lower health risks.
              </p>
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
