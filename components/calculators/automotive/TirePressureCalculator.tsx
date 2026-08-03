'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TirePressureCalculator() {
  const [tempStr, setTempStr] = useState('70') // Fahrenheit
  const [recommendedPressureStr, setRecommendedPressureStr] = useState('32') // PSI

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, correctedPressure: 0, steps: [] as string[] }
    const t = parseFloat(tempStr)
    const rec = parseFloat(recommendedPressureStr)
    if (isNaN(t) || isNaN(rec) || rec <= 0) return { ...defaultObj, error: 'Please enter valid parameters.' }
    // Gay-Lussac law approximation: approx 1 PSI change for every 10 degree F difference from standard 68F
    const diff = t - 68
    const correctedPressure = rec + (diff / 10)
    return {
      error: null,
      correctedPressure,
      steps: [
        `Standard ambient baseline: 68°F`,
        `Tire pressure changes ~1 PSI per 10°F change`,
        `Estimated Corrected Pressure = ${correctedPressure.toFixed(1)} PSI`
      ]
    }
  }, [tempStr, recommendedPressureStr])

  return (
    <FormCalculatorShell title="Tire Pressure Temperature Solver" subtitle="Adjust recommended tire pressures for ambient weather shifts" badge="AUTOMOTIVE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Recommended PSI (on placard)" value={recommendedPressureStr} onChange={setRecommendedPressureStr} id="tp-psi" />
          <RetroInput label="Outside Temperature (°F)" value={tempStr} onChange={setTempStr} id="tp-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Target PSI Cold" value={results.correctedPressure.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
