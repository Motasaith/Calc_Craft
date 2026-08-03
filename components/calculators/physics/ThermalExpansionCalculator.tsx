'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ThermalExpansionCalculator() {
  const [lenStr, setLenStr] = useState('10') // initial length
  const [coeffStr, setCoeffStr] = useState('12') // linear coefficient (steel approx 12e-6)
  const [tempStr, setTempStr] = useState('50') // temperature change C

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, deltaL: 0 }
    const l0 = parseFloat(lenStr)
    const alpha = parseFloat(coeffStr)
    const dt = parseFloat(tempStr)

    if (isNaN(l0) || isNaN(alpha) || isNaN(dt) || l0 <= 0 || alpha < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // delta L = alpha * 10^-6 * L0 * delta T
    const deltaL = (alpha * 1e-6) * l0 * dt
    return { error: null, deltaL }
  }, [lenStr, coeffStr, tempStr])

  return (
    <FormCalculatorShell title="Linear Thermal Expansion Solver" subtitle="Calculate expansion length changes due to temperature variations" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Initial Length (meters)" value={lenStr} onChange={setLenStr} id="te-l" />
          <RetroInput label="Coeff alpha (x10^-6 /°C)" value={coeffStr} onChange={setCoeffStr} id="te-a" />
          <RetroInput label="Temp Change (ΔT, °C)" value={tempStr} onChange={setTempStr} id="te-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Expansion Delta (ΔL)" value={`${results.deltaL.toFixed(6)} meters`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
