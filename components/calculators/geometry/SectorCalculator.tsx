'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SectorCalculator() {
  const [rStr, setRStr] = useState('5')
  const [thetaStr, setThetaStr] = useState('60') // in degrees

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      area: 0,
      arcLength: 0,
      perimeter: 0,
      steps: [] as string[]
    }

    const r = parseFloat(rStr)
    const theta = parseFloat(thetaStr)

    if (isNaN(r) || isNaN(theta) || r <= 0 || theta <= 0 || theta > 360) {
      return { ...defaultObj, error: 'Please enter valid radius and angle (0° to 360°).' }
    }

    const rad = theta * (Math.PI / 180)
    const area = 0.5 * r * r * rad
    const arcLength = r * rad
    const perimeter = arcLength + 2 * r

    const steps = [
      `Angle in radians = ${theta}° × (π / 180) = ${rad.toFixed(4)} rad`,
      `Arc Length = r × θ = ${r} × ${rad.toFixed(4)} = ${arcLength.toFixed(4)}`,
      `Area = 0.5 × r² × θ = 0.5 × ${r * r} × ${rad.toFixed(4)} = ${area.toFixed(4)}`,
      `Perimeter = Arc Length + 2r = ${arcLength.toFixed(4)} + 2(${r}) = ${perimeter.toFixed(4)}`
    ]

    return {
      error: null,
      area,
      arcLength,
      perimeter,
      steps
    }
  }, [rStr, thetaStr])

  return (
    <FormCalculatorShell title="Circle Sector Calculator" subtitle="Solve area, arc length, and perimeter of a circle sector" badge="GEOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Radius (r)" value={rStr} onChange={setRStr} id="sec-r" />
          <RetroInput label="Angle θ (degrees)" value={thetaStr} onChange={setThetaStr} id="sec-theta" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Area" value={results.area.toFixed(4)} />
                <ResultDisplay label="Arc Length" value={results.arcLength.toFixed(4)} />
                <ResultDisplay label="Perimeter" value={results.perimeter.toFixed(4)} />
              </div>

              <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">Sector Visual</p>
                <svg viewBox="0 0 120 120" className="w-32 h-32">
                  <path d="M 60 60 L 95 60 A 35 35 0 0 0 77.5 30 Z" fill="#8ab4a0" stroke="#4c5c4a" strokeWidth="2" />
                  <circle cx="60" cy="60" r="3" fill="#1f2937" />
                  <text x="75" y="70" fontSize="7" fontWeight="bold" fill="#4c5c4a" fontFamily="monospace">r</text>
                  <text x="64" y="54" fontSize="7" fontWeight="bold" fill="#b5655c" fontFamily="monospace">θ</text>
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
