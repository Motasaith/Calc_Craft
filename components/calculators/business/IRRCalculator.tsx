'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function IRRCalculator() {
  const [flowsStr, setFlowsStr] = useState('-10000, 3000, 4000, 5000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, irr: 0 }
    const flows = flowsStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
    if (flows.length < 2) return { ...defaultObj, error: 'Please enter at least 2 flows.' }

    // Simple brute-force IRR guess (0% to 100%)
    let bestRate = 0
    let minNpvAbs = Infinity
    for (let r = -0.2; r <= 1.0; r += 0.001) {
      let npv = 0
      for (let t = 0; t < flows.length; t++) {
        npv += flows[t] / Math.pow(1 + r, t)
      }
      if (Math.abs(npv) < minNpvAbs) {
        minNpvAbs = Math.abs(npv)
        bestRate = r
      }
    }

    return { error: null, irr: bestRate * 100 }
  }, [flowsStr])

  return (
    <FormCalculatorShell title="Internal Rate of Return IRR Solver" subtitle="Estimate IRR percentage yields on project capital outflows" badge="BUSINESS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Cash Flows Series (Initial Outlay first)" value={flowsStr} onChange={setFlowsStr} id="irr-f" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated IRR Yield" value={`${results.irr.toFixed(2)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
