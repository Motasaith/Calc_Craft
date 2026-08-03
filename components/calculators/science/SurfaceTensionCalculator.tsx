'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SurfaceTensionCalculator() {
  const [forceStr, setForceStr] = useState('0.07') // Newtons
  const [lengthStr, setLengthStr] = useState('1.0') // meters

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, tension: 0 }
    const f = parseFloat(forceStr)
    const l = parseFloat(lengthStr)

    if (isNaN(f) || isNaN(l) || f < 0 || l <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const tension = f / l
    return { error: null, tension }
  }, [forceStr, lengthStr])

  return (
    <FormCalculatorShell title="Fluid Surface Tension Solver" subtitle="Calculate surface tension coefficient gamma = F / L" badge="SCIENCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Force Exerted (Newtons)" value={forceStr} onChange={setForceStr} id="st-f" />
          <RetroInput label="Contact Line Length (meters)" value={lengthStr} onChange={setLengthStr} id="st-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Surface Tension (γ)" value={`${results.tension.toFixed(4)} N/m`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
