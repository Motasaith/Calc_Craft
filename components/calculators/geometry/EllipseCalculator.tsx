'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function EllipseCalculator() {
  const [aStr, setAStr] = useState('5')
  const [bStr, setBStr] = useState('3')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      area: 0,
      circumference: 0,
      eccentricity: 0,
      steps: [] as string[]
    }

    const a = parseFloat(aStr)
    const b = parseFloat(bStr)

    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive axis values.' }
    }

    const area = Math.PI * a * b
    const h = Math.pow((a - b) / (a + b), 2)
    const circumference = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
    const eccentricity = Math.sqrt(1 - (b * b) / (a * a))

    const steps = [
      `Area = π × a × b = 3.14159 × ${a} × ${b} = ${area.toFixed(4)}`,
      `Eccentricity = √(1 - (b²/a²)) = ${eccentricity.toFixed(4)}`,
      `Ramanujan Circumference Approx = ${circumference.toFixed(4)}`
    ]

    return {
      error: null,
      area,
      circumference,
      eccentricity,
      steps
    }
  }, [aStr, bStr])

  return (
    <FormCalculatorShell title="Ellipse Calculator" subtitle="Solve area, circumference, and eccentricity of an ellipse" badge="GEOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Semi-Major Axis (a)" value={aStr} onChange={setAStr} id="ell-a" />
          <RetroInput label="Semi-Minor Axis (b)" value={bStr} onChange={setBStr} id="ell-b" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Area" value={results.area.toFixed(4)} />
                <ResultDisplay label="Circumference" value={results.circumference.toFixed(4)} />
                <ResultDisplay label="Eccentricity" value={results.eccentricity.toFixed(4)} />
              </div>

              <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">Ellipse Outline Diagram</p>
                <svg viewBox="0 0 120 120" className="w-32 h-32">
                  <ellipse cx="60" cy="60" rx="45" ry="27" fill="#8ab4a0" stroke="#4c5c4a" strokeWidth="2" />
                  <line x1="60" y1="60" x2="105" y2="60" stroke="#b5655c" strokeWidth="1.5" strokeDasharray="2 2" />
                  <line x1="60" y1="60" x2="60" y2="87" stroke="#dfaa44" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x="82.5" y="55" fontSize="8" fontWeight="bold" fill="#b5655c" fontFamily="monospace">a</text>
                  <text x="63" y="77.5" fontSize="8" fontWeight="bold" fill="#be8b32" fontFamily="monospace">b</text>
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
