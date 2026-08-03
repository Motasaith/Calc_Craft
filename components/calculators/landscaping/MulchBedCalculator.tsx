'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MulchBedCalculator() {
  const [areaStr, setAreaStr] = useState('150')
  const [depthStr, setDepthStr] = useState('2') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, yards: 0 }
    const a = parseFloat(areaStr)
    const d = parseFloat(depthStr)

    if (isNaN(a) || isNaN(d) || a <= 0 || d <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const cubicFeet = a * (d / 12)
    const yards = cubicFeet / 27 // 27 cubic feet in a cubic yard

    return { error: null, yards }
  }, [areaStr, depthStr])

  return (
    <FormCalculatorShell title="Garden Mulch Bed Solver" subtitle="Calculate cubic yards of garden mulch needed for coverages" badge="LANDSCAPING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Garden Area (sq ft)" value={areaStr} onChange={setAreaStr} id="mb-a" />
          <RetroInput label="Depth (inches)" value={depthStr} onChange={setDepthStr} id="mb-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Mulch Required (Cubic Yards)" value={results.yards.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
