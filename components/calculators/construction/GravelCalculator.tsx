'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GravelCalculator() {
  const [areaStr, setAreaStr] = useState('200')
  const [depthStr, setDepthStr] = useState('3') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, tons: 0 }
    const a = parseFloat(areaStr)
    const d = parseFloat(depthStr)

    if (isNaN(a) || isNaN(d) || a <= 0 || d <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const cubicFeet = a * (d / 12)
    // Gravel weight approx 105 lbs per cubic foot. 1 ton = 2000 lbs.
    const tons = (cubicFeet * 105) / 2000

    return { error: null, tons }
  }, [areaStr, depthStr])

  return (
    <FormCalculatorShell title="Gravel Volume Solver" subtitle="Calculate tons of gravel needed for driveways or paths" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Base Area (sq ft)" value={areaStr} onChange={setAreaStr} id="gr-a" />
          <RetroInput label="Depth (inches)" value={depthStr} onChange={setDepthStr} id="gr-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Gravel Required (Tons)" value={results.tons.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
