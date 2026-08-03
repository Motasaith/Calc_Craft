'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TrapezoidCalculator() {
  const [aStr, setAStr] = useState('6') // base a
  const [bStr, setBStr] = useState('10') // base b
  const [hStr, setHStr] = useState('5') // height h

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      area: 0,
      steps: [] as string[]
    }

    const a = parseFloat(aStr)
    const b = parseFloat(bStr)
    const h = parseFloat(hStr)

    if (isNaN(a) || isNaN(b) || isNaN(h) || a <= 0 || b <= 0 || h <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    }

    const area = 0.5 * (a + b) * h

    const steps = [
      `Area = 0.5 × (a + b) × h`,
      `Area = 0.5 × (${a} + ${b}) × ${h}`,
      `Area = 0.5 × ${a + b} × ${h} = ${area.toFixed(4)}`
    ]

    return {
      error: null,
      area,
      steps
    }
  }, [aStr, bStr, hStr])

  return (
    <FormCalculatorShell title="Trapezoid Calculator" subtitle="Solve area of a trapezoid (trapezium) given bases and height" badge="GEOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Top Base (a)" value={aStr} onChange={setAStr} id="trap-a" />
          <RetroInput label="Bottom Base (b)" value={bStr} onChange={setBStr} id="trap-b" />
          <RetroInput label="Height (h)" value={hStr} onChange={setHStr} id="trap-h" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-1">
                <ResultDisplay label="Area" value={results.area.toFixed(4)} large />
              </div>

              <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">Trapezoid Visual Shape</p>
                <svg viewBox="0 0 120 120" className="w-32 h-32">
                  <polygon points="35,35 85,35 105,85 15,85" fill="#8ab4a0" stroke="#4c5c4a" strokeWidth="2" />
                  <line x1="35" y1="35" x2="35" y2="85" stroke="#b5655c" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x="60" y="30" fontSize="8" fontWeight="bold" fill="#1f2937" fontFamily="monospace" textAnchor="middle">a</text>
                  <text x="60" y="97" fontSize="8" fontWeight="bold" fill="#1f2937" fontFamily="monospace" textAnchor="middle">b</text>
                  <text x="27" y="60" fontSize="8" fontWeight="bold" fill="#b5655c" fontFamily="monospace">h</text>
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
