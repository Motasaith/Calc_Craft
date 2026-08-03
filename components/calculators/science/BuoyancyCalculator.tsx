'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BuoyancyCalculator() {
  const [volStr, setVolStr] = useState('0.5') // cubic meters V
  const [densityStr, setDensityStr] = useState('1000') // fluid density kg/m³

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, force: 0 }
    const v = parseFloat(volStr)
    const rho = parseFloat(densityStr)

    if (isNaN(v) || isNaN(rho) || v <= 0 || rho <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const g = 9.80665 // gravity m/s²
    const force = rho * v * g
    return { error: null, force }
  }, [volStr, densityStr])

  return (
    <FormCalculatorShell title="Archimedes Buoyant Force Solver" subtitle="Calculate water or fluid displacement upward buoyant forces" badge="SCIENCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Displaced Volume (m³)" value={volStr} onChange={setVolStr} id="by-v" />
          <RetroInput label="Fluid Density (kg/m³)" value={densityStr} onChange={setDensityStr} id="by-rho" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Buoyant Force (Fb)" value={`${results.force.toFixed(1)} Newtons`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
