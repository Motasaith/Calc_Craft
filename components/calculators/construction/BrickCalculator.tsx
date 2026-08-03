'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BrickCalculator() {
  const [areaStr, setAreaStr] = useState('100') // sq ft
  const [wasteStr, setWasteStr] = useState('10') // % waste

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, bricks: 0, steps: [] as string[] }
    const a = parseFloat(areaStr)
    const w = parseFloat(wasteStr)
    if (isNaN(a) || isNaN(w) || a <= 0 || w < 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    // Standard US modular brick: 7.2 bricks per sq ft (with 3/8" mortar joints)
    const rawBricks = a * 7.2
    const totalBricks = rawBricks * (1 + w / 100)
    return {
      error: null,
      bricks: Math.ceil(totalBricks),
      steps: [
        `Standard brick coverage: 7.2 bricks/sq ft (with mortar)`,
        `Raw bricks = ${a} sq ft × 7.2 = ${rawBricks.toFixed(1)} bricks`,
        `Total with ${w}% waste = ${Math.ceil(totalBricks)} bricks`
      ]
    }
  }, [areaStr, wasteStr])

  return (
    <FormCalculatorShell title="Brick & Wall Solver" subtitle="Calculate bricks needed for masonry walls" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Wall Area (sq ft)" value={areaStr} onChange={setAreaStr} id="bk-a" />
          <RetroInput label="Waste Factor (%)" value={wasteStr} onChange={setWasteStr} id="bk-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Bricks Needed" value={results.bricks.toLocaleString()} large />
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
