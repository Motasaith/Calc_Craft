'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CementMortarCalculator() {
  const [volStr, setVolStr] = useState('10') // cubic feet

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, bagsCement: 0, bagsSand: 0, steps: [] as string[] }
    const v = parseFloat(volStr)
    if (isNaN(v) || v <= 0) return { ...defaultObj, error: 'Please enter a valid positive volume.' }
    // 1:3 mix ratio: approx 22.5 lbs cement, 67.5 lbs sand per cu ft
    const cementLbs = v * 22.5
    const sandLbs = v * 67.5
    const bagsCement = cementLbs / 94 // 94 lb standard bag
    const bagsSand = sandLbs / 100 // 100 lb bag
    return {
      error: null,
      bagsCement,
      bagsSand,
      steps: [
        `1:3 Mortar mix ratio per cu ft: 22.5 lbs Cement, 67.5 lbs Sand`,
        `Total Cement = ${cementLbs.toFixed(1)} lbs (${bagsCement.toFixed(2)} bags)`,
        `Total Sand = ${sandLbs.toFixed(1)} lbs (${bagsSand.toFixed(2)} bags)`
      ]
    }
  }, [volStr])

  return (
    <FormCalculatorShell title="Cement Mortar Solver" subtitle="Calculate cement and sand bags for masonry mixes" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Required Volume (cu ft)" value={volStr} onChange={setVolStr} id="cm-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Cement Bags (94 lb)" value={results.bagsCement.toFixed(2)} large />
              <ResultDisplay label="Sand Bags (100 lb)" value={results.bagsSand.toFixed(2)} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
