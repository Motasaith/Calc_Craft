'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WienDisplacementCalculator() {
  const [tempStr, setTempStr] = useState('5778') // Kelvin

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, wavelength: 0, steps: [] as string[] }
    const t = parseFloat(tempStr)
    if (isNaN(t) || t <= 0) return { ...defaultObj, error: 'Please enter a valid positive temperature.' }
    const b = 2.897771955e-3 // m K
    const wavelength = b / t
    return {
      error: null,
      wavelength,
      steps: [
        `Wien Displacement Constant b = 2.89777 × 10⁻³ m·K`,
        `Formula: λ_max = b / T`,
        `Peak Wavelength = ${(wavelength * 1e9).toFixed(2)} nm`
      ]
    }
  }, [tempStr])

  return (
    <FormCalculatorShell title="Wien's Displacement Law Solver" subtitle="Find peak wavelength of blackbody radiation" badge="ASTRONOMY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Temperature (K)" value={tempStr} onChange={setTempStr} id="wd-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Peak Wavelength (nm)" value={(results.wavelength * 1e9).toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
