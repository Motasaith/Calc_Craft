'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SphereCalculator() {
  const [rStr, setRStr] = useState('5')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      volume: 0,
      surfaceArea: 0,
      steps: [] as string[]
    }

    const r = parseFloat(rStr)

    if (isNaN(r) || r <= 0) {
      return { ...defaultObj, error: 'Please enter a valid positive radius.' }
    }

    const volume = (4 / 3) * Math.PI * Math.pow(r, 3)
    const surfaceArea = 4 * Math.PI * r * r

    const steps = [
      `Volume = (4/3) × π × r³ = (4/3) × 3.14159 × ${r}³ = ${volume.toFixed(4)}`,
      `Surface Area = 4 × π × r² = 4 × 3.14159 × ${r}² = ${surfaceArea.toFixed(4)}`
    ]

    return {
      error: null,
      volume,
      surfaceArea,
      steps
    }
  }, [rStr])

  return (
    <FormCalculatorShell title="Sphere Geometry Calculator" subtitle="Solve volume and surface area parameters of a sphere" badge="GEOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Radius (r)" value={rStr} onChange={setRStr} id="sph-r" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Volume (V)" value={results.volume.toFixed(4)} large />
                <ResultDisplay label="Surface Area (A)" value={results.surfaceArea.toFixed(4)} large />
              </div>

              <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">Spherical Volume Sketch</p>
                <svg viewBox="0 0 120 120" className="w-32 h-32">
                  <circle cx="60" cy="60" r="35" fill="#8ab4a0" stroke="#4c5c4a" strokeWidth="2" />
                  <ellipse cx="60" cy="60" rx="35" ry="10" fill="none" stroke="#4c5c4a" strokeWidth="1" strokeDasharray="3 2" />
                  <line x1="60" y1="60" x2="95" y2="60" stroke="#b5655c" strokeWidth="1.5" />
                  <text x="77.5" y="55" fontSize="8" fontWeight="bold" fill="#b5655c" fontFamily="monospace">r</text>
                </svg>
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
