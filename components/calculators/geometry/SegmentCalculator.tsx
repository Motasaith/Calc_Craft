'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SegmentCalculator() {
  const [rStr, setRStr] = useState('5')
  const [thetaStr, setThetaStr] = useState('90') // in degrees

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      area: 0,
      arcLength: 0,
      chordLength: 0,
      steps: [] as string[]
    }

    const r = parseFloat(rStr)
    const theta = parseFloat(thetaStr)

    if (isNaN(r) || isNaN(theta) || r <= 0 || theta <= 0 || theta > 360) {
      return { ...defaultObj, error: 'Please enter valid radius and angle (0° to 360°).' }
    }

    const rad = theta * (Math.PI / 180)
    const area = 0.5 * r * r * (rad - Math.sin(rad))
    const arcLength = r * rad
    const chordLength = 2 * r * Math.sin(rad / 2)

    const steps = [
      `Angle in radians = ${theta}° × (π / 180) = ${rad.toFixed(4)} rad`,
      `Chord Length = 2 × r × sin(θ/2) = 2 × ${r} × sin(${(theta / 2).toFixed(1)}°) = ${chordLength.toFixed(4)}`,
      `Arc Length = r × θ = ${r} × ${rad.toFixed(4)} = ${arcLength.toFixed(4)}`,
      `Segment Area = 0.5 × r² × (θ - sin(θ)) = ${area.toFixed(4)}`
    ]

    return {
      error: null,
      area,
      arcLength,
      chordLength,
      steps
    }
  }, [rStr, thetaStr])

  return (
    <FormCalculatorShell title="Circular Segment Calculator" subtitle="Solve area, chord length, and arc of a circular segment" badge="GEOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Radius (r)" value={rStr} onChange={setRStr} id="seg-r" />
          <RetroInput label="Central Angle θ (degrees)" value={thetaStr} onChange={setThetaStr} id="seg-theta" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Segment Area" value={results.area.toFixed(4)} />
                <ResultDisplay label="Arc Length" value={results.arcLength.toFixed(4)} />
                <ResultDisplay label="Chord Length" value={results.chordLength.toFixed(4)} />
              </div>

              <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">Segment Highlight Visual</p>
                <svg viewBox="0 0 120 120" className="w-32 h-32">
                  <path d="M 60 60 L 95 60 A 35 35 0 0 0 60 25 Z" fill="none" stroke="#4c5c4a" strokeWidth="1.5" />
                  <path d="M 95 60 A 35 35 0 0 0 60 25 Z" fill="#8ab4a0" stroke="#b5655c" strokeWidth="2.5" />
                  <line x1="95" y1="60" x2="60" y2="25" stroke="#be8b32" strokeWidth="2" />
                  <circle cx="60" cy="60" r="3" fill="#1f2937" />
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
