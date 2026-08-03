'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WaterPressureCalculator() {
  const [heightStr, setHeightStr] = useState('50') // feet of head

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, psi: 0, steps: [] as string[] }
    const h = parseFloat(heightStr)
    if (isNaN(h) || h < 0) return { ...defaultObj, error: 'Please enter a valid positive height.' }
    // 1 foot of water head = 0.433 PSI
    const psi = h * 0.433
    return {
      error: null,
      psi,
      steps: [
        `Hydrostatic pressure rule: 1 foot of water column = 0.433 PSI`,
        `Pressure = ${h} ft × 0.433 = ${psi.toFixed(2)} PSI`
      ]
    }
  }, [heightStr])

  return (
    <FormCalculatorShell title="Water Hydrostatic Pressure Solver" subtitle="Solve water pressure PSI from head height columns" badge="PLUMBING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Water Head Height (feet)" value={heightStr} onChange={setHeightStr} id="wp-h" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Hydrostatic Pressure (PSI)" value={results.psi.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
