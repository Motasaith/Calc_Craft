'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function StairCalculator() {
  const [riseStr, setRiseStr] = useState('100') // inches total rise

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, risers: 0, riserHeight: 0 }
    const rise = parseFloat(riseStr)
    if (isNaN(rise) || rise <= 0) return { ...defaultObj, error: 'Please enter a valid rise.' }
    // Target 7 inch riser height standard
    const risers = Math.round(rise / 7)
    const riserHeight = rise / risers
    return { error: null, risers, riserHeight }
  }, [riseStr])

  return (
    <FormCalculatorShell title="Stair Rise and Run Solver" subtitle="Calculate required riser count and riser height for staircases" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Rise Height (inches)" value={riseStr} onChange={setRiseStr} id="st-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Total Risers" value={results.risers.toString()} />
              <ResultDisplay label="Riser Height (in)" value={results.riserHeight.toFixed(2)} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
