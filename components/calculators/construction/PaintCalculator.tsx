'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PaintCalculator() {
  const [areaStr, setAreaStr] = useState('350') // sq ft

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, gallons: 0, steps: [] as string[] }
    const a = parseFloat(areaStr)
    if (isNaN(a) || a <= 0) return { ...defaultObj, error: 'Please enter a valid positive area.' }
    // Standard rule: 1 gallon of paint covers 350 sq ft
    const gallons = a / 350
    return {
      error: null,
      gallons,
      steps: [
        `Paint coverage standard: 350 sq ft per gallon`,
        `Gallons needed = Area / 350 = ${gallons.toFixed(2)} gallons`
      ]
    }
  }, [areaStr])

  return (
    <FormCalculatorShell title="Paint Volume Solver" subtitle="Calculate paint gallons needed for wall surfaces" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Wall Area (sq ft)" value={areaStr} onChange={setAreaStr} id="pt-a" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Paint Needed (Gallons)" value={results.gallons.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
