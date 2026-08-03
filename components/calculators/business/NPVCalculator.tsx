'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function NPVCalculator() {
  const [discountStr, setDiscountStr] = useState('8') // % discount rate
  const [flowsStr, setFlowsStr] = useState('-10000, 3000, 4000, 5000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, npv: 0 }
    const rate = parseFloat(discountStr)
    const flows = flowsStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))

    if (isNaN(rate) || rate < 0 || flows.length < 1) {
      return { ...defaultObj, error: 'Please enter valid discount rate and cash flows.' }
    }

    const r = rate / 100
    let npv = 0
    for (let t = 0; t < flows.length; t++) {
      npv += flows[t] / Math.pow(1 + r, t)
    }

    return { error: null, npv }
  }, [discountStr, flowsStr])

  return (
    <FormCalculatorShell title="Net Present Value NPV Solver" subtitle="Discount cash flows to evaluate capital investment prospects" badge="BUSINESS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Discount Rate (%)" value={discountStr} onChange={setDiscountStr} id="npv-r" />
          <RetroInput label="Cash Flows Array (Initial Outlay first)" value={flowsStr} onChange={setFlowsStr} id="npv-f" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Net Present Value (NPV)" value={results.npv.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
