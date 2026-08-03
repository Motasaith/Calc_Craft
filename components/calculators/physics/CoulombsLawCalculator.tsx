'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CoulombsLawCalculator() {
  const [q1Str, setQ1Str] = useState('1e-6') // Charge 1 (C)
  const [q2Str, setQ2Str] = useState('-2e-6') // Charge 2 (C)
  const [rStr, setRStr] = useState('0.05') // distance (m)

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      force: 0,
      steps: [] as string[]
    }

    const q1 = parseFloat(q1Str)
    const q2 = parseFloat(q2Str)
    const r = parseFloat(rStr)

    if (isNaN(q1) || isNaN(q2) || isNaN(r) || r <= 0) {
      return { ...defaultObj, error: 'Please enter valid charges and positive distance.' }
    }

    const k = 8.9875517923e9
    const force = (k * Math.abs(q1 * q2)) / (r * r)
    const direction = q1 * q2 < 0 ? 'Attractive (opposite charges)' : 'Repulsive (like charges)'

    const steps = [
      `k = 8.9876 × 10⁹ N·m²/C²`,
      `Force = (k × |q₁ × q₂|) / r²`,
      `Force = ${force.toFixed(4)} N`,
      `Force direction is: ${direction}`
    ]

    return {
      error: null,
      force,
      steps
    }
  }, [q1Str, q2Str, rStr])

  return (
    <FormCalculatorShell title="Coulomb's Law Calculator" subtitle="Solve electrostatic force between two point charges" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Charge 1 (q₁ in Coulombs)" value={q1Str} onChange={setQ1Str} id="coul-q1" />
          <RetroInput label="Charge 2 (q₂ in Coulombs)" value={q2Str} onChange={setQ2Str} id="coul-q2" />
          <RetroInput label="Distance r (meters)" value={rStr} onChange={setRStr} id="coul-r" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-1">
                <ResultDisplay label="Electrostatic Force (F)" value={`${results.force.toFixed(4)} N`} large />
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
