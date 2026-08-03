'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FertilizerCalculator() {
  const [areaStr, setAreaStr] = useState('1000') // sq ft
  const [rateStr, setRateStr] = useState('1') // lb N per 1000 sq ft
  const [nPctStr, setNPctStr] = useState('20') // % Nitrogen in fertilizer

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, needed: 0, steps: [] as string[] }
    const a = parseFloat(areaStr)
    const r = parseFloat(rateStr)
    const p = parseFloat(nPctStr)
    if (isNaN(a) || isNaN(r) || isNaN(p) || a <= 0 || r <= 0 || p <= 0 || p > 100) {
      return { ...defaultObj, error: 'Please enter valid positive values (N% must be between 1 and 100).' }
    }
    const needed = (a / 1000) * r * (100 / p)
    return {
      error: null,
      needed,
      steps: [
        `Nitrogen needed = (Area / 1000) × Rate = (${a} / 1000) × ${r} = ${((a / 1000) * r).toFixed(2)} lbs`,
        `Fertilizer needed = Nitrogen needed × (100 / N%) = ${needed.toFixed(2)} lbs`
      ]
    }
  }, [areaStr, rateStr, nPctStr])

  return (
    <FormCalculatorShell title="Fertilizer Application Solver" subtitle="Calculate fertilizer bags needed based on area and NPK content" badge="AGRICULTURE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Lawn/Field Area (sq ft)" value={areaStr} onChange={setAreaStr} id="fert-a" />
          <RetroInput label="Target Nitrogen Rate (lb/1000 sq ft)" value={rateStr} onChange={setRateStr} id="fert-r" />
          <RetroInput label="Nitrogen percentage in Bag (N%)" value={nPctStr} onChange={setNPctStr} id="fert-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Fertilizer Needed (lbs)" value={results.needed.toFixed(2)} large />
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
