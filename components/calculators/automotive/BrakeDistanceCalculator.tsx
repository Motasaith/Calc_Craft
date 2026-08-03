'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BrakeDistanceCalculator() {
  const [speedStr, setSpeedStr] = useState('60') // mph
  const [frictionStr, setFrictionStr] = useState('0.7') // dry asphalt

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, brakingDistance: 0, steps: [] as string[] }
    const v = parseFloat(speedStr)
    const f = parseFloat(frictionStr)
    if (isNaN(v) || isNaN(f) || v <= 0 || f <= 0) return { ...defaultObj, error: 'Please enter valid positive parameters.' }
    // d = v^2 / (2 * f * g) where v is in ft/s, g = 32.2 ft/s^2
    const speedFps = v * 1.46667
    const brakingDistance = (speedFps * speedFps) / (2 * f * 32.2)
    return {
      error: null,
      brakingDistance,
      steps: [
        `Speed in ft/s = ${v} mph × 1.467 = ${speedFps.toFixed(1)} ft/s`,
        `Formula: d = v² / (2 × f × g) [g = 32.2 ft/s²]`,
        `Braking Distance = ${brakingDistance.toFixed(1)} feet`
      ]
    }
  }, [speedStr, frictionStr])

  return (
    <FormCalculatorShell title="Braking Distance Solver" subtitle="Calculate stopping distance based on speed and friction coefficient" badge="AUTOMOTIVE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Vehicle Speed (mph)" value={speedStr} onChange={setSpeedStr} id="bd-s" />
          <RetroInput label="Friction Coeff (f) - e.g. dry road=0.7, wet=0.4" value={frictionStr} onChange={setFrictionStr} id="bd-f" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Stopping Distance (feet)" value={results.brakingDistance.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
