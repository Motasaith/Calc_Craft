'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function KineticEnergyCalculator() {
  const [massStr, setMassStr] = useState('10') // kg
  const [velStr, setVelStr] = useState('8') // m/s

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      ke: 0,
      steps: [] as string[]
    }

    const m = parseFloat(massStr)
    const v = parseFloat(velStr)

    if (isNaN(m) || isNaN(v) || m <= 0) {
      return { ...defaultObj, error: 'Please enter a valid positive mass and velocity.' }
    }

    const ke = 0.5 * m * v * v
    const steps = [
      `Formula: KE = 0.5 × m × v²`,
      `KE = 0.5 × ${m} kg × (${v} m/s)²`,
      `KE = 0.5 × ${m} × ${v * v} = ${ke.toFixed(2)} J`
    ]

    return {
      error: null,
      ke,
      steps
    }
  }, [massStr, velStr])

  return (
    <FormCalculatorShell title="Kinetic Energy Calculator" subtitle="Solve kinetic energy of a moving mass" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Mass (kg)" value={massStr} onChange={setMassStr} id="ke-m" />
          <RetroInput label="Velocity (m/s)" value={velStr} onChange={setVelStr} id="ke-v" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-1">
                <ResultDisplay label="Kinetic Energy (KE)" value={`${results.ke.toFixed(2)} J`} large />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Formula Steps</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results.error}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
