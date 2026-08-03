'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function LawnAreaCalculator() {
  const [widthStr, setWidthStr] = useState('50')
  const [lengthStr, setLengthStr] = useState('100')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, area: 0, steps: [] as string[] }
    const w = parseFloat(widthStr)
    const l = parseFloat(lengthStr)
    if (isNaN(w) || isNaN(l) || w <= 0 || l <= 0) return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    const area = w * l
    return {
      error: null,
      area,
      steps: [
        `Lawn Area = Width × Length = ${w} × ${l} = ${area} sq ft`,
        `Acre equivalent = ${(area / 43560).toFixed(4)} acres`
      ]
    }
  }, [widthStr, lengthStr])

  return (
    <FormCalculatorShell title="Lawn Area Solver" subtitle="Calculate lawn square footage for seed and weed applications" badge="LANDSCAPING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Width (ft)" value={widthStr} onChange={setWidthStr} id="la-w" />
          <RetroInput label="Length (ft)" value={lengthStr} onChange={setLengthStr} id="la-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Lawn Area (sq ft)" value={results.area.toFixed(1)} large />
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
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
