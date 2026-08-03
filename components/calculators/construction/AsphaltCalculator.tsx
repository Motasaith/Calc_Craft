'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AsphaltCalculator() {
  const [lengthStr, setLengthStr] = useState('50') // feet
  const [widthStr, setWidthStr] = useState('10') // feet
  const [depthStr, setDepthStr] = useState('3') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, tons: 0, steps: [] as string[] }
    const l = parseFloat(lengthStr)
    const w = parseFloat(widthStr)
    const d = parseFloat(depthStr)
    if (isNaN(l) || isNaN(w) || isNaN(d) || l <= 0 || w <= 0 || d <= 0) return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    // Asphalt density: approx 148 lbs/cu ft
    const cubicFeet = l * w * (d / 12)
    const tons = (cubicFeet * 148) / 2000
    return {
      error: null,
      tons,
      steps: [
        `Area = ${l} ft × ${w} ft = ${l * w} sq ft`,
        `Volume = ${l * w} sq ft × (${d}/12) ft = ${cubicFeet.toFixed(2)} cu ft`,
        `Weight (tons) = (Volume × 148 lbs/cu ft) / 2000 = ${tons.toFixed(2)} tons`
      ]
    }
  }, [lengthStr, widthStr, depthStr])

  return (
    <FormCalculatorShell title="Asphalt Volume & Weight Solver" subtitle="Calculate tons of asphalt needed for driveways or lots" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Length (feet)" value={lengthStr} onChange={setLengthStr} id="asp-l" />
          <RetroInput label="Width (feet)" value={widthStr} onChange={setWidthStr} id="asp-w" />
          <RetroInput label="Depth (inches)" value={depthStr} onChange={setDepthStr} id="asp-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Asphalt Needed (Tons)" value={results.tons.toFixed(2)} large />
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
