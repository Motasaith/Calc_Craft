'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CylinderGeoCalculator() {
  const [rStr, setRStr] = useState('3')
  const [hStr, setHStr] = useState('8')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      volume: 0,
      surfaceArea: 0,
      lateralArea: 0,
      steps: [] as string[]
    }

    const r = parseFloat(rStr)
    const h = parseFloat(hStr)

    if (isNaN(r) || isNaN(h) || r <= 0 || h <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive radius and height.' }
    }

    const volume = Math.PI * r * r * h
    const lateralArea = 2 * Math.PI * r * h
    const surfaceArea = lateralArea + 2 * Math.PI * r * r

    const steps = [
      `Volume = π × r² × h = 3.14159 × ${r}² × ${h} = ${volume.toFixed(4)}`,
      `Lateral Area = 2 × π × r × h = ${lateralArea.toFixed(4)}`,
      `Total Surface Area = 2πr(r + h) = ${surfaceArea.toFixed(4)}`
    ]

    return {
      error: null,
      volume,
      surfaceArea,
      lateralArea,
      steps
    }
  }, [rStr, hStr])

  return (
    <FormCalculatorShell title="Cylinder Geometry Calculator" subtitle="Solve volume, lateral area, and total surface area of a cylinder" badge="GEOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Radius (r)" value={rStr} onChange={setRStr} id="cyl-r" />
          <RetroInput label="Height (h)" value={hStr} onChange={setHStr} id="cyl-h" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Volume" value={results.volume.toFixed(4)} />
                <ResultDisplay label="Surface Area" value={results.surfaceArea.toFixed(4)} />
                <ResultDisplay label="Lateral Area" value={results.lateralArea.toFixed(4)} />
              </div>

              <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">Cylinder Wireframe Sketch</p>
                <svg viewBox="0 0 120 120" className="w-32 h-32">
                  <path d="M 40 30 A 20 8 0 1 0 80 30 A 20 8 0 1 0 40 30" fill="none" stroke="#4c5c4a" strokeWidth="2" />
                  <path d="M 40 90 A 20 8 0 1 0 80 90 A 20 8 0 1 0 40 90" fill="#8ab4a0" stroke="#4c5c4a" strokeWidth="2" />
                  <line x1="40" y1="30" x2="40" y2="90" stroke="#4c5c4a" strokeWidth="2" />
                  <line x1="80" y1="30" x2="80" y2="90" stroke="#4c5c4a" strokeWidth="2" />
                  <line x1="60" y1="90" x2="80" y2="90" stroke="#b5655c" strokeWidth="1.5" />
                  <text x="70" y="87" fontSize="7" fontWeight="bold" fill="#b5655c" fontFamily="monospace">r</text>
                  <text x="86" y="60" fontSize="7" fontWeight="bold" fill="#1f2937" fontFamily="monospace">h</text>
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
