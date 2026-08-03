'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function EscapeVelocityCalculator() {
  const [massStr, setMassStr] = useState('5.972e24') // Earth mass (kg)
  const [radiusStr, setRadiusStr] = useState('6.371e6') // Earth radius (m)

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      ev: 0,
      steps: [] as string[]
    }

    const m = parseFloat(massStr)
    const r = parseFloat(radiusStr)

    if (isNaN(m) || isNaN(r) || m <= 0 || r <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive mass and radius.' }
    }

    const G = 6.6743e-11
    const ev = Math.sqrt((2 * G * m) / r)

    const steps = [
      `G = 6.6743 × 10⁻¹¹ N·m²/kg²`,
      `Formula: v_e = √(2 × G × M / R)`,
      `v_e = √(2 × ${G.toExponential(4)} × ${m.toExponential(4)} / ${r.toExponential(4)})`,
      `Escape Velocity = ${ev.toFixed(2)} m/s (${(ev / 1000).toFixed(3)} km/s)`
    ]

    return {
      error: null,
      ev,
      steps
    }
  }, [massStr, radiusStr])

  return (
    <FormCalculatorShell title="Escape Velocity Calculator" subtitle="Solve speed needed to break free from a gravitational body" badge="ASTRONOMY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Body Mass M (kg)" value={massStr} onChange={setMassStr} id="ev-m" />
          <RetroInput label="Body Radius R (meters)" value={radiusStr} onChange={setRadiusStr} id="ev-r" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Escape Velocity (m/s)" value={results.ev.toFixed(2)} large />
                <ResultDisplay label="Escape Velocity (km/s)" value={(results.ev / 1000).toFixed(3)} large />
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
