'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WindowAreaCalculator() {
  const [widthStr, setWidthStr] = useState('36') // inches
  const [heightStr, setHeightStr] = useState('60') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, sqft: 0 }
    const w = parseFloat(widthStr)
    const h = parseFloat(heightStr)

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      return { ...defaultObj, error: 'Please enter valid dimensions.' }
    }

    const sqft = (w * h) / 144
    return { error: null, sqft }
  }, [widthStr, heightStr])

  return (
    <FormCalculatorShell title="Window Glass Area Solver" subtitle="Calculate window panel opening areas in square feet" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Window Width (inches)" value={widthStr} onChange={setWidthStr} id="wa-w" />
          <RetroInput label="Window Height (inches)" value={heightStr} onChange={setHeightStr} id="wa-h" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Glass Area (sq ft)" value={`${results.sqft.toFixed(2)} sq ft`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
