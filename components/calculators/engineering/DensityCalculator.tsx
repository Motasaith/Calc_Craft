'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DensityCalculator() {
  const [massStr, setMassStr] = useState('100') // grams
  const [volStr, setVolStr] = useState('50') // mL or cm³

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, density: 0 }
    const m = parseFloat(massStr)
    const v = parseFloat(volStr)

    if (isNaN(m) || isNaN(v) || m < 0 || v <= 0) {
      return { ...defaultObj, error: 'Please enter valid mass and volume values.' }
    }

    const density = m / v
    return { error: null, density }
  }, [massStr, volStr])

  return (
    <FormCalculatorShell title="Density Solver" subtitle="Calculate density rho = mass / volume" badge="ENGINEERING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Mass (grams)" value={massStr} onChange={setMassStr} id="dns-m" />
          <RetroInput label="Volume (mL/cm³)" value={volStr} onChange={setVolStr} id="dns-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Density (ρ)" value={`${results.density.toFixed(3)} g/cm³`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
