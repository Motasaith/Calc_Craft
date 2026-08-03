'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FreeFallCalculator() {
  const [timeStr, setTimeStr] = useState('3') // seconds
  const [gStr, setGStr] = useState('9.80665') // m/s²

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      distance: 0,
      velocity: 0,
      steps: [] as string[]
    }

    const t = parseFloat(timeStr)
    const g = parseFloat(gStr)

    if (isNaN(t) || isNaN(g) || t < 0 || g <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const distance = 0.5 * g * t * t
    const velocity = g * t

    const steps = [
      `Distance = 0.5 × g × t² = 0.5 × ${g} × ${t}² = ${distance.toFixed(4)} m`,
      `Velocity = g × t = ${g} × ${t} = ${velocity.toFixed(4)} m/s`
    ]

    return {
      error: null,
      distance,
      velocity,
      steps
    }
  }, [timeStr, gStr])

  return (
    <FormCalculatorShell title="Free Fall Calculator" subtitle="Solve distance and velocity of a falling object" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Fall Time (seconds)" value={timeStr} onChange={setTimeStr} id="ff-t" />
          <RetroInput label="Gravity g (m/s²)" value={gStr} onChange={setGStr} id="ff-g" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Distance Fallen" value={`${results.distance.toFixed(2)} m`} large />
                <ResultDisplay label="Terminal Velocity" value={`${results.velocity.toFixed(2)} m/s`} large />
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
