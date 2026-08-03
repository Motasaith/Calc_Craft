'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function IrrigationCalculator() {
  const [areaStr, setAreaStr] = useState('5000') // sq ft
  const [depthStr, setDepthStr] = useState('1') // inches of water

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, gallons: 0, steps: [] as string[] }
    const a = parseFloat(areaStr)
    const d = parseFloat(depthStr)
    if (isNaN(a) || isNaN(d) || a <= 0 || d <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    // 1 inch of water over 1 sq ft = 0.623379 gallons
    const gallons = a * d * 0.623379
    return {
      error: null,
      gallons,
      steps: [
        `1 inch of water over 1 sq ft = 0.623379 gallons`,
        `Total = ${a} sq ft × ${d} inches × 0.623379 = ${gallons.toFixed(2)} gallons`
      ]
    }
  }, [areaStr, depthStr])

  return (
    <FormCalculatorShell title="Irrigation Water Volumizer" subtitle="Solve water gallons needed for fields/gardens" badge="AGRICULTURE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Area (sq ft)" value={areaStr} onChange={setAreaStr} id="irr-a" />
          <RetroInput label="Target Water Depth (inches)" value={depthStr} onChange={setDepthStr} id="irr-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Water Volume Needed (gallons)" value={results.gallons.toLocaleString(undefined, {maximumFractionDigits: 1})} large />
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
