'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RoiCalculator() {
  const [costStr, setCostStr] = useState('1000')
  const [gainStr, setGainStr] = useState('1500')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, roi: 0, gainNet: 0, steps: [] as string[] }
    const cost = parseFloat(costStr)
    const gain = parseFloat(gainStr)
    if (isNaN(cost) || isNaN(gain) || cost <= 0) {
      return { ...defaultObj, error: 'Please enter a valid positive cost value.' }
    }
    const gainNet = gain - cost
    const roi = (gainNet / cost) * 100
    return {
      error: null,
      roi,
      gainNet,
      steps: [
        `Net Gain = Investment Gain - Investment Cost = $${gain} - $${cost} = $${gainNet.toFixed(2)}`,
        `ROI = (Net Gain / Cost) × 100 = ($${gainNet.toFixed(2)} / $${cost}) × 100 = ${roi.toFixed(2)}%`
      ]
    }
  }, [costStr, gainStr])

  return (
    <FormCalculatorShell title="ROI Investment Solver" subtitle="Calculate Return on Investment percentage metrics" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Investment Cost ($)" value={costStr} onChange={setCostStr} id="roi-c" />
          <RetroInput label="Total Return / Value ($)" value={gainStr} onChange={setGainStr} id="roi-g" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Return on Investment" value={`${results.roi.toFixed(2)}%`} large />
                <ResultDisplay label="Net Gain" value={results.gainNet.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
