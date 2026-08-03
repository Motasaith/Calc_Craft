'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PlanetaryOrbitCalculator() {
  const [semiMajorAxisStr, setSemiMajorAxisStr] = useState('1.496e11') // Earth semi-major (m)
  const [massStr, setMassStr] = useState('1.989e30') // Sun mass (kg)

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, period: 0 }
    const a = parseFloat(semiMajorAxisStr)
    const m = parseFloat(massStr)
    if (isNaN(a) || isNaN(m) || a <= 0 || m <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const G = 6.6743e-11
    const period = Math.sqrt((4 * Math.PI * Math.PI * Math.pow(a, 3)) / (G * m))
    return { error: null, period }
  }, [semiMajorAxisStr, massStr])

  return (
    <FormCalculatorShell title="Planetary Orbit Period Solver" subtitle="Calculate Keplerian orbital cycles" badge="ASTRONOMY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Semi-Major Axis (m)" value={semiMajorAxisStr} onChange={setSemiMajorAxisStr} id="po-a" />
          <RetroInput label="Central Body Mass (kg)" value={massStr} onChange={setMassStr} id="po-m" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Orbit Period (days)" value={(results.period / 86400).toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
