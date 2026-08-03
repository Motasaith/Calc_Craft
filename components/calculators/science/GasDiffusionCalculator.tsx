'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GasDiffusionCalculator() {
  const [m1Str, setM1Str] = useState('4') // Helium mass
  const [m2Str, setM2Str] = useState('32') // Oxygen mass

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ratio: 0 }
    const m1 = parseFloat(m1Str)
    const m2 = parseFloat(m2Str)

    if (isNaN(m1) || isNaN(m2) || m1 <= 0 || m2 <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive molar masses.' }
    }

    // Graham's Law: r1/r2 = sqrt(m2/m1)
    const ratio = Math.sqrt(m2 / m1)
    return { error: null, ratio }
  }, [m1Str, m2Str])

  return (
    <FormCalculatorShell title="Graham's Law of Gas Diffusion Solver" subtitle="Calculate gas diffusion rate ratios based on molecular mass" badge="SCIENCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Molar Mass Gas 1 (g/mol)" value={m1Str} onChange={setM1Str} id="gd-m1" />
          <RetroInput label="Molar Mass Gas 2 (g/mol)" value={m2Str} onChange={setM2Str} id="gd-m2" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Diffusion Rate Ratio (r₁/r₂)" value={results.ratio.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
