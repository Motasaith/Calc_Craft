'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CropYieldCalculator() {
  const [areaStr, setAreaStr] = useState('10') // acres
  const [yieldPerAcreStr, setYieldPerAcreStr] = useState('150') // bushels

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, total: 0, steps: [] as string[] }
    const a = parseFloat(areaStr)
    const y = parseFloat(yieldPerAcreStr)
    if (isNaN(a) || isNaN(y) || a <= 0 || y < 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const total = a * y
    return {
      error: null,
      total,
      steps: [
        `Formula: Total Yield = Area × Yield per Unit Area`,
        `Total = ${a} acres × ${y} bushels/acre = ${total.toLocaleString()} bushels`
      ]
    }
  }, [areaStr, yieldPerAcreStr])

  return (
    <FormCalculatorShell title="Crop Yield Solver" subtitle="Estimate harvest yields based on field size and yields" badge="AGRICULTURE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Area (acres)" value={areaStr} onChange={setAreaStr} id="cy-a" />
          <RetroInput label="Yield per Acre (bushels)" value={yieldPerAcreStr} onChange={setYieldPerAcreStr} id="cy-y" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Total Yield (bushels)" value={results.total.toLocaleString()} large />
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
