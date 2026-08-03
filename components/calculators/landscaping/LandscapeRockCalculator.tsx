'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function LandscapeRockCalculator() {
  const [areaStr, setAreaStr] = useState('200')
  const [depthStr, setDepthStr] = useState('3') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, tons: 0 }
    const a = parseFloat(areaStr)
    const d = parseFloat(depthStr)

    if (isNaN(a) || isNaN(d) || a <= 0 || d <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // Rock weights approx 100 lbs per cubic foot. 1 ton = 2000 lbs.
    const cubicFeet = a * (d / 12)
    const tons = (cubicFeet * 100) / 2000

    return { error: null, tons }
  }, [areaStr, depthStr])

  return (
    <FormCalculatorShell title="Landscape Rock Volume Solver" subtitle="Calculate tons of decorative gravel or rocks needed for gardens" badge="LANDSCAPING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Garden Area (sq ft)" value={areaStr} onChange={setAreaStr} id="lr-a" />
          <RetroInput label="Depth (inches)" value={depthStr} onChange={setDepthStr} id="lr-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Rocks Required (Tons)" value={results.tons.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
