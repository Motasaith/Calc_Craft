'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function StefanBoltzmannCalculator() {
  const [tempStr, setTempStr] = useState('5778') // Sun temp (K)
  const [areaStr, setAreaStr] = useState('6.09e18') // Sun surface area (m²)

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, power: 0, steps: [] as string[] }
    const t = parseFloat(tempStr)
    const a = parseFloat(areaStr)
    if (isNaN(t) || isNaN(a) || t <= 0 || a <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const sigma = 5.670374419e-8
    const power = sigma * a * Math.pow(t, 4)
    return {
      error: null,
      power,
      steps: [
        `Formula: P = σ × A × T⁴`,
        `σ = 5.67037 × 10⁻⁸ W/(m²·K⁴)`,
        `P = ${power.toExponential(4)} W`
      ]
    }
  }, [tempStr, areaStr])

  return (
    <FormCalculatorShell title="Stefan-Boltzmann Law Solver" subtitle="Calculate blackbody radiative power" badge="ASTRONOMY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Temperature (K)" value={tempStr} onChange={setTempStr} id="sb-t" />
          <RetroInput label="Surface Area (m²)" value={areaStr} onChange={setAreaStr} id="sb-a" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Total Power (Watts)" value={results.power.toExponential(4)} large />
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
