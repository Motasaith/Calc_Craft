'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type KnownType = 'radius' | 'diameter' | 'area' | 'circumference'

export default function CircleCalculator() {
  const [mode, setMode] = useState<KnownType>('radius')
  const [valStr, setValStr] = useState('5')

  // Calculations
  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      r: 0,
      d: 0,
      a: 0,
      c: 0,
      formulas: [] as { name: string; formula: string; calculation: string }[]
    }

    const v = parseFloat(valStr)
    if (isNaN(v) || v <= 0) {
      return { ...defaultObj, error: 'Please enter a valid positive number.' }
    }

    let r = 0
    let steps: { name: string; formula: string; calculation: string }[] = []

    switch (mode) {
      case 'radius':
        r = v
        steps = [
          { name: 'Diameter', formula: 'd = 2 × r', calculation: `2 × ${r} = ${(2 * r).toFixed(4)}` },
          { name: 'Circumference', formula: 'c = 2 × π × r', calculation: `2 × 3.14159 × ${r} = ${(2 * Math.PI * r).toFixed(4)}` },
          { name: 'Area', formula: 'A = π × r²', calculation: `3.14159 × ${r}² = ${(Math.PI * r * r).toFixed(4)}` }
        ]
        break
      case 'diameter':
        r = v / 2
        steps = [
          { name: 'Radius', formula: 'r = d / 2', calculation: `${v} / 2 = ${(v / 2).toFixed(4)}` },
          { name: 'Circumference', formula: 'c = π × d', calculation: `3.14159 × ${v} = ${(Math.PI * v).toFixed(4)}` },
          { name: 'Area', formula: 'A = π × (d/2)²', calculation: `3.14159 × (${v}/2)² = ${(Math.PI * r * r).toFixed(4)}` }
        ]
        break
      case 'area':
        r = Math.sqrt(v / Math.PI)
        steps = [
          { name: 'Radius', formula: 'r = √(A / π)', calculation: `√(${v} / 3.14159) = ${r.toFixed(4)}` },
          { name: 'Diameter', formula: 'd = 2 × r', calculation: `2 × ${r.toFixed(4)} = ${(2 * r).toFixed(4)}` },
          { name: 'Circumference', formula: 'c = 2 × √(π × A)', calculation: `2 × √(3.14159 × ${v}) = ${(2 * Math.PI * r).toFixed(4)}` }
        ]
        break
      case 'circumference':
        r = v / (2 * Math.PI)
        steps = [
          { name: 'Radius', formula: 'r = c / (2 × π)', calculation: `${v} / (2 × 3.14159) = ${r.toFixed(4)}` },
          { name: 'Diameter', formula: 'd = c / π', calculation: `${v} / 3.14159 = ${(v / Math.PI).toFixed(4)}` },
          { name: 'Area', formula: 'A = c² / (4 × π)', calculation: `${v}² / (4 × 3.14159) = ${(Math.PI * r * r).toFixed(4)}` }
        ]
        break
    }

    return {
      error: null,
      r,
      d: r * 2,
      a: Math.PI * r * r,
      c: 2 * Math.PI * r,
      formulas: steps
    }
  }, [mode, valStr])

  return (
    <FormCalculatorShell title="Circle Calculator" subtitle="Solve radius, diameter, area, and circumference parameters" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        
        {/* ── Left Column: Inputs ── */}
        <div className="space-y-4">
          <RetroSelect
            label="Known Parameter"
            value={mode}
            onChange={(v) => setMode(v as KnownType)}
            id="circ-mode"
            options={[
              { value: 'radius', label: 'Radius (r)' },
              { value: 'diameter', label: 'Diameter (d)' },
              { value: 'area', label: 'Area (A)' },
              { value: 'circumference', label: 'Circumference (c)' }
            ]}
          />
          <RetroInput
            label={`Input ${mode.charAt(0).toUpperCase() + mode.slice(1)} Value`}
            value={valStr}
            onChange={setValStr}
            placeholder="5.0"
            id="circ-val"
          />
        </div>

        {/* ── Right Column: Results & Visualization ── */}
        <div className="min-h-[440px]">
          {results && !results.error ? (
            <div className="space-y-4">
              
              {/* Primary grid parameters */}
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Radius (r)" value={results.r.toFixed(4)} />
                <ResultDisplay label="Diameter (d)" value={results.d.toFixed(4)} />
                <ResultDisplay label="Area (A)" value={results.a.toFixed(4)} large />
                <ResultDisplay label="Circumference (c)" value={results.c.toFixed(4)} large />
              </div>

              {/* Circle SVG */}
              <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                <p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">
                  Circular Geometry Map
                </p>
                <svg viewBox="0 0 140 140" className="w-36 h-36" role="img" aria-label="A circles diagram mapping the diameter line, radius segment, and shaded area.">
                  {/* Shaded Area */}
                  <circle cx="70" cy="70" r="50" fill="#8ab4a0" opacity="0.8" stroke="#4c5c4a" strokeWidth="2.5" />
                  
                  {/* Center Dot */}
                  <circle cx="70" cy="70" r="3" fill="#1f2937" />
                  
                  {/* Radius Line (dashed) */}
                  <line x1="70" y1="70" x2="120" y2="70" stroke="#b5655c" strokeWidth="2.5" strokeDasharray="3 2" />
                  <text x="95" y="62" fontSize="8" fontWeight="bold" fill="#b5655c" fontFamily="monospace" textAnchor="middle">
                    r
                  </text>

                  {/* Diameter Line (solid, background) */}
                  <line x1="20" y1="70" x2="70" y2="70" stroke="#dfaa44" strokeWidth="2" />
                  <text x="45" y="62" fontSize="8" fontWeight="bold" fill="#be8b32" fontFamily="monospace" textAnchor="middle">
                    d
                  </text>
                </svg>
              </div>

              {/* Period table / Steps */}
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                  Calculations & Formulas
                </p>
                <div className="divide-y divide-neutral-200 text-xs font-mono">
                  {results.formulas.map((item, idx) => (
                    <div key={idx} className="p-2.5 flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold uppercase text-neutral-500">{item.name}</span>
                      <div className="flex justify-between text-neutral-800">
                        <span>{item.formula}</span>
                        <span className="font-bold">{item.calculation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results?.error || 'Enter a valid value to solve the circle.'}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
