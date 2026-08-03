'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GreenhouseAreaCalculator() {
  const [widthStr, setWidthStr] = useState('12')
  const [lengthStr, setLengthStr] = useState('20')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, area: 0, steps: [] as string[] }
    const w = parseFloat(widthStr)
    const l = parseFloat(lengthStr)
    if (isNaN(w) || isNaN(l) || w <= 0 || l <= 0) return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    const area = w * l
    return {
      error: null,
      area,
      steps: [
        `Area = Width × Length`,
        `Area = ${w} × ${l} = ${area} sq ft`
      ]
    }
  }, [widthStr, lengthStr])

  return (
    <FormCalculatorShell title="Greenhouse Area Solver" subtitle="Solve footprint area for greenhouses" badge="AGRICULTURE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Width (ft)" value={widthStr} onChange={setWidthStr} id="gh-w" />
          <RetroInput label="Length (ft)" value={lengthStr} onChange={setLengthStr} id="gh-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Footprint Area (sq ft)" value={results.area.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
