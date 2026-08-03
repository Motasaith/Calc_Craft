'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TopsoilCalculator() {
  const [areaStr, setAreaStr] = useState('200')
  const [depthStr, setDepthStr] = useState('2') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, yards: 0 }
    const a = parseFloat(areaStr)
    const d = parseFloat(depthStr)

    if (isNaN(a) || isNaN(d) || a <= 0 || d <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const cubicFeet = a * (d / 12)
    const yards = cubicFeet / 27
    return { error: null, yards }
  }, [areaStr, depthStr])

  return (
    <FormCalculatorShell title="Garden Topsoil Volume Solver" subtitle="Calculate cubic yards of topsoil needed for garden beds" badge="LANDSCAPING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Bed Area (sq ft)" value={areaStr} onChange={setAreaStr} id="ts-a" />
          <RetroInput label="Soil Depth (inches)" value={depthStr} onChange={setDepthStr} id="ts-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Topsoil Required (Cubic Yards)" value={results.yards.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
