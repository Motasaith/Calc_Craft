'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DeckCalculator() {
  const [wStr, setWStr] = useState('12')
  const [lStr, setLStr] = useState('16')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, area: 0, steps: [] as string[] }
    const w = parseFloat(wStr)
    const l = parseFloat(lStr)
    if (isNaN(w) || isNaN(l) || w <= 0 || l <= 0) return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    return {
      error: null,
      area: w * l,
      steps: [
        `Deck Area = Width × Length = ${w} × dots = ${w * l} sq ft`
      ]
    }
  }, [wStr, lStr])

  return (
    <FormCalculatorShell title="Deck Area & Estimator" subtitle="Calculate deck surface footprint" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Width (ft)" value={wStr} onChange={setWStr} id="dk-w" />
          <RetroInput label="Length (ft)" value={lStr} onChange={setLStr} id="dk-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Deck Area (sq ft)" value={results.area.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
