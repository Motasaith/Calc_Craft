'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PotentialEnergyCalculator() {
  const [massStr, setMassStr] = useState('10') // kg
  const [heightStr, setHeightStr] = useState('5') // meters
  const [gStr, setGStr] = useState('9.80665') // m/s²

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      pe: 0,
      steps: [] as string[]
    }

    const m = parseFloat(massStr)
    const h = parseFloat(heightStr)
    const g = parseFloat(gStr)

    if (isNaN(m) || isNaN(h) || isNaN(g) || m <= 0 || h < 0 || g <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive parameters.' }
    }

    const pe = m * g * h
    const steps = [
      `Formula: PE = m × g × h`,
      `PE = ${m} kg × ${g} m/s² × ${h} m = ${pe.toFixed(2)} J`
    ]

    return {
      error: null,
      pe,
      steps
    }
  }, [massStr, heightStr, gStr])

  return (
    <FormCalculatorShell title="Potential Energy Calculator" subtitle="Solve gravitational potential energy of an elevated mass" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Mass (kg)" value={massStr} onChange={setMassStr} id="pe-m" />
          <RetroInput label="Height (m)" value={heightStr} onChange={setHeightStr} id="pe-h" />
          <RetroInput label="Gravity g (m/s²)" value={gStr} onChange={setGStr} id="pe-g" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-1">
                <ResultDisplay label="Potential Energy (PE)" value={`${results.pe.toFixed(2)} J`} large />
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
