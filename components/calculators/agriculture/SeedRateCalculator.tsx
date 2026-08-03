'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SeedRateCalculator() {
  const [areaStr, setAreaStr] = useState('1') // acre
  const [targetPlantsStr, setTargetPlantsStr] = useState('30000') // plants/acre
  const [germinationStr, setGerminationStr] = useState('90') // %
  const [purityStr, setPurityStr] = useState('95') // %

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, seedsNeeded: 0, steps: [] as string[] }
    const a = parseFloat(areaStr)
    const t = parseFloat(targetPlantsStr)
    const g = parseFloat(germinationStr)
    const p = parseFloat(purityStr)
    if (isNaN(a) || isNaN(t) || isNaN(g) || isNaN(p) || a <= 0 || t <= 0 || g <= 0 || p <= 0 || g > 100 || p > 100) {
      return { ...defaultObj, error: 'Please enter valid positive percentages and counts.' }
    }
    const seedsNeeded = (t * a) / ((g / 100) * (p / 100))
    return {
      error: null,
      seedsNeeded,
      steps: [
        `Pure Live Seed (PLS) factor = (${g} / 100) × (${p} / 100) = ${((g * p) / 10000).toFixed(4)}`,
        `Total Seeds = (Target Plants × Area) / PLS factor`,
        `Total Seeds = ${Math.round(seedsNeeded).toLocaleString()} seeds`
      ]
    }
  }, [areaStr, targetPlantsStr, germinationStr, purityStr])

  return (
    <FormCalculatorShell title="Seed Rate Solver" subtitle="Calculate seeds needed based on field target and germination success" badge="AGRICULTURE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Field Area (acres)" value={areaStr} onChange={setAreaStr} id="sr-a" />
          <RetroInput label="Target Plant Population per Acre" value={targetPlantsStr} onChange={setTargetPlantsStr} id="sr-t" />
          <RetroInput label="Germination Rate (%)" value={germinationStr} onChange={setGerminationStr} id="sr-g" />
          <RetroInput label="Seed Purity (%)" value={purityStr} onChange={setPurityStr} id="sr-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Total Seeds Needed" value={Math.round(results.seedsNeeded).toLocaleString()} large />
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
