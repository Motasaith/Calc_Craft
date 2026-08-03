'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CommissionCalculator() {
  const [salesStr, setSalesStr] = useState('10000')
  const [rateStr, setRateStr] = useState('5.0') // %

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, commission: 0 }
    const s = parseFloat(salesStr)
    const r = parseFloat(rateStr)
    if (isNaN(s) || isNaN(r) || s < 0 || r < 0) return { ...defaultObj, error: 'Please enter valid parameters.' }
    const commission = s * (r / 100)
    return { error: null, commission }
  }, [salesStr, rateStr])

  return (
    <FormCalculatorShell title="Sales Commission Solver" subtitle="Calculate commission earnings from total sales values" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Sales Value ($)" value={salesStr} onChange={setSalesStr} id="comm-s" />
          <RetroInput label="Commission Rate (%)" value={rateStr} onChange={setRateStr} id="comm-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Commission Earned" value={results.commission.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
