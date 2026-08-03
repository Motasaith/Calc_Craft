'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CentripetalForceCalculator() {
  const [massStr, setMassStr] = useState('10')
  const [velStr, setVelStr] = useState('5')
  const [rStr, setRStr] = useState('2')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      force: 0,
      steps: [] as string[]
    }

    const m = parseFloat(massStr)
    const v = parseFloat(velStr)
    const r = parseFloat(rStr)

    if (isNaN(m) || isNaN(v) || isNaN(r) || m <= 0 || r <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive parameters (radius and mass must be positive).' }
    }

    const force = (m * v * v) / r
    const steps = [
      `Formula: Fc = (m × v²) / r`,
      `Fc = (${m} × ${v}²) / ${r}`,
      `Fc = (${m} × ${v * v}) / ${r} = ${force.toFixed(2)} N`
    ]

    return {
      error: null,
      force,
      steps
    }
  }, [massStr, velStr, rStr])

  return (
    <FormCalculatorShell title="Centripetal Force Solver" subtitle="Find forces in circular motion pathways" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Mass (kg)" value={massStr} onChange={setMassStr} id="cf-m" />
          <RetroInput label="Velocity (m/s)" value={velStr} onChange={setVelStr} id="cf-v" />
          <RetroInput label="Radius (m)" value={rStr} onChange={setRStr} id="cf-r" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-1">
                <ResultDisplay label="Centripetal Force (Fc)" value={`${results.force.toFixed(2)} N`} large />
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
