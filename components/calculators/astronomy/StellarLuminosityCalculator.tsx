'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function StellarLuminosityCalculator() {
  const [radiusStr, setRadiusStr] = useState('1') // Solar radii
  const [tempStr, setTempStr] = useState('5778') // Kelvin

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, luminosity: 0, steps: [] as string[] }
    const r = parseFloat(radiusStr)
    const t = parseFloat(tempStr)
    if (isNaN(r) || isNaN(t) || r <= 0 || t <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    // L/L_sun = (R/R_sun)^2 * (T/T_sun)^4
    const l = Math.pow(r, 2) * Math.pow(t / 5778, 4)
    return {
      error: null,
      luminosity: l,
      steps: [
        `Formula: L/L☉ = (R/R☉)² × (T/T☉)⁴`,
        `Relative Luminosity = ${l.toFixed(4)} L☉`
      ]
    }
  }, [radiusStr, tempStr])

  return (
    <FormCalculatorShell title="Stellar Luminosity Solver" subtitle="Calculate star luminosity relative to the Sun" badge="ASTRONOMY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Radius (Solar Radii R☉)" value={radiusStr} onChange={setRadiusStr} id="sl-r" />
          <RetroInput label="Temperature (K)" value={tempStr} onChange={setTempStr} id="sl-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Luminosity (L☉)" value={results.luminosity.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
