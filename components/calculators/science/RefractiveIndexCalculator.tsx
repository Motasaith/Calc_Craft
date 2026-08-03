'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RefractiveIndexCalculator() {
  const [speedStr, setSpeedStr] = useState('200000') // km/s in medium

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, n: 0, steps: [] as string[] }
    const v = parseFloat(speedStr)
    if (isNaN(v) || v <= 0) return { ...defaultObj, error: 'Please enter a valid positive velocity.' }
    const c = 299792.458 // km/s
    if (v > c) return { ...defaultObj, error: 'Velocity cannot exceed light speed in vacuum (c = 299,792 km/s).' }
    const n = c / v
    return {
      error: null,
      n,
      steps: [
        `c = 299,792.458 km/s (light speed in vacuum)`,
        `Formula: n = c / v`,
        `Index of Refraction = ${n.toFixed(4)}`
      ]
    }
  }, [speedStr])

  return (
    <FormCalculatorShell title="Index of Refraction Solver" subtitle="Calculate refractive index based on light speed in medium" badge="SCIENCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Light Speed in Medium (km/s)" value={speedStr} onChange={setSpeedStr} id="ri-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Refractive Index (n)" value={results.n.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
