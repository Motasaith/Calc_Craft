'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GravitationalForceCalculator() {
  const [m1Str, setM1Str] = useState('5.972e24') // Earth mass (kg)
  const [m2Str, setM2Str] = useState('7.342e22') // Moon mass (kg)
  const [rStr, setRStr] = useState('3.844e8') // distance (m)

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      force: 0,
      steps: [] as string[]
    }

    const m1 = parseFloat(m1Str)
    const m2 = parseFloat(m2Str)
    const r = parseFloat(rStr)

    if (isNaN(m1) || isNaN(m2) || isNaN(r) || m1 <= 0 || m2 <= 0 || r <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive masses and distance.' }
    }

    const G = 6.6743e-11
    const force = (G * m1 * m2) / (r * r)

    const steps = [
      `G = 6.6743 × 10⁻¹¹ N·m²/kg²`,
      `Force = (G × m₁ × m₂) / r²`,
      `Force = ${force.toExponential(4)} N`
    ]

    return {
      error: null,
      force,
      steps
    }
  }, [m1Str, m2Str, rStr])

  return (
    <FormCalculatorShell title="Gravitational Force Calculator" subtitle="Solve Newton's Law of Universal Gravitation" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Mass 1 (kg)" value={m1Str} onChange={setM1Str} id="grav-m1" />
          <RetroInput label="Mass 2 (kg)" value={m2Str} onChange={setM2Str} id="grav-m2" />
          <RetroInput label="Distance r (m)" value={rStr} onChange={setRStr} id="grav-r" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-1">
                <ResultDisplay label="Force (F)" value={`${results.force.toExponential(4)} N`} large />
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
