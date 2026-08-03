'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function NDFilterCalculator() {
  const [shutterStr, setShutterStr] = useState('0.008') // 1/125s
  const [stopsStr, setStopsStr] = useState('10') // 10-stop ND filter

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, adjusted: 0 }
    const t = parseFloat(shutterStr)
    const s = parseFloat(stopsStr)
    if (isNaN(t) || isNaN(s) || t <= 0 || s < 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const adjusted = t * Math.pow(2, s)
    return { error: null, adjusted }
  }, [shutterStr, stopsStr])

  return (
    <FormCalculatorShell title="Neutral Density ND Filter Solver" subtitle="Calculate shutter time adjustments for ND filters" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Base Shutter Speed (seconds)" value={shutterStr} onChange={setShutterStr} id="nd-t" />
          <RetroInput label="Filter Reduction Stops" value={stopsStr} onChange={setStopsStr} id="nd-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Adjusted Shutter Speed (sec)" value={results.adjusted.toFixed(3)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
