'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ConeCalculator() {
  const [rStr, setRStr] = useState('3')
  const [hStr, setHStr] = useState('7')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      volume: 0,
      surfaceArea: 0,
      slantHeight: 0,
      steps: [] as string[]
    }

    const r = parseFloat(rStr)
    const h = parseFloat(hStr)

    if (isNaN(r) || isNaN(h) || r <= 0 || h <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive radius and height.' }
    }

    const slantHeight = Math.sqrt(r * r + h * h)
    const volume = (1 / 3) * Math.PI * r * r * h
    const surfaceArea = Math.PI * r * (r + slantHeight)

    const steps = [
      `Slant Height (s) = √(r² + h²) = √(${r}² + ${h}²) = ${slantHeight.toFixed(4)}`,
      `Volume = (1/3) × π × r² × h = (1/3) × 3.14159 × ${r * r} × ${h} = ${volume.toFixed(4)}`,
      `Surface Area = π × r × (r + s) = 3.14159 × ${r} × (${r} + ${slantHeight.toFixed(2)}) = ${surfaceArea.toFixed(4)}`
    ]

    return {
      error: null,
      volume,
      surfaceArea,
      slantHeight,
      steps
    }
  }, [rStr, hStr])

  return (
    <FormCalculatorShell title="Cone Geometry Calculator" subtitle="Solve volume, surface area, and slant height of a circular cone" badge="GEOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Radius (r)" value={rStr} onChange={setRStr} id="cone-r" />
          <RetroInput label="Height (h)" value={hStr} onChange={setHStr} id="cone-h" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Volume" value={results.volume.toFixed(4)} />
                <ResultDisplay label="Surface Area" value={results.surfaceArea.toFixed(4)} />
                <ResultDisplay label="Slant Height" value={results.slantHeight.toFixed(4)} />
              </div>

              <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">Cone Section Visual</p>
                <svg viewBox="0 0 120 120" className="w-32 h-32">
                  <polygon points="60,20 30,90 90,90" fill="#8ab4a0" opacity="0.8" stroke="#4c5c4a" strokeWidth="2" />
                  <ellipse cx="60" cy="90" rx="30" ry="9" fill="none" stroke="#4c5c4a" strokeWidth="1" strokeDasharray="3 2" />
                  <line x1="60" y1="20" x2="60" y2="90" stroke="#b5655c" strokeWidth="1.5" strokeDasharray="2 2" />
                  <line x1="60" y1="90" x2="90" y2="90" stroke="#dfaa44" strokeWidth="1.5" />
                  <text x="50" y="55" fontSize="7" fontWeight="bold" fill="#b5655c" fontFamily="monospace">h</text>
                  <text x="75" y="87" fontSize="7" fontWeight="bold" fill="#be8b32" fontFamily="monospace">r</text>
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
