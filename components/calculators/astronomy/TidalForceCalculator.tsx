'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TidalForceCalculator() {
  const [mStr, setMStr] = useState('7.342e22') // Moon mass (kg)
  const [rStr, setRStr] = useState('3.844e8') // Moon distance (m)
  const [radStr, setRadStr] = useState('6.371e6') // Earth radius (m)

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, force: 0 }
    const m = parseFloat(mStr)
    const r = parseFloat(rStr)
    const rad = parseFloat(radStr)
    if (isNaN(m) || isNaN(r) || isNaN(rad) || m <= 0 || r <= 0 || rad <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const G = 6.6743e-11
    const force = (2 * G * m * rad) / Math.pow(r, 3)
    return { error: null, force }
  }, [mStr, rStr, radStr])

  return (
    <FormCalculatorShell title="Tidal Force Solver" subtitle="Calculate differential gravitational tidal forces" badge="ASTRONOMY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Disturbing Mass M (kg)" value={mStr} onChange={setMStr} id="tf-m" />
          <RetroInput label="Orbit Distance d (m)" value={rStr} onChange={setRStr} id="tf-d" />
          <RetroInput label="Body Radius r (m)" value={radStr} onChange={setRadStr} id="tf-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Tidal Acceleration (m/s²)" value={results.force.toExponential(6)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
