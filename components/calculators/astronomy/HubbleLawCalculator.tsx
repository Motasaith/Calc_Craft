'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HubbleLawCalculator() {
  const [distStr, setDistStr] = useState('50') // Mpc
  const [h0Str, setH0Str] = useState('70') // km/s/Mpc

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, velocity: 0, steps: [] as string[] }
    const d = parseFloat(distStr)
    const h0 = parseFloat(h0Str)
    if (isNaN(d) || isNaN(h0) || d <= 0 || h0 <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const velocity = h0 * d
    return {
      error: null,
      velocity,
      steps: [
        `Hubble Law: v = H₀ × d`,
        `v = ${h0} km/s/Mpc × ${d} Mpc = ${velocity.toFixed(2)} km/s`
      ]
    }
  }, [distStr, h0Str])

  return (
    <FormCalculatorShell title="Hubble's Law Calculator" subtitle="Solve recession velocity of galaxies" badge="ASTRONOMY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Distance (Mpc)" value={distStr} onChange={setDistStr} id="hl-d" />
          <RetroInput label="Hubble Constant H₀" value={h0Str} onChange={setH0Str} id="hl-h0" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Recession Velocity" value={`${results.velocity.toFixed(2)} km/s`} large />
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Steps</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
