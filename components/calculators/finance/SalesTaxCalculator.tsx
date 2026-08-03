'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SalesTaxCalculator() {
  const [netStr, setNetStr] = useState('100')
  const [rateStr, setRateStr] = useState('8.25') // %

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, tax: 0, gross: 0 }
    const net = parseFloat(netStr)
    const rate = parseFloat(rateStr)
    if (isNaN(net) || isNaN(rate) || net < 0 || rate < 0) return { ...defaultObj, error: 'Please enter valid parameters.' }
    const tax = net * (rate / 100)
    const gross = net + tax
    return { error: null, tax, gross }
  }, [netStr, rateStr])

  return (
    <FormCalculatorShell title="Sales Tax Solver" subtitle="Calculate sales tax margins and gross transaction prices" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Net Price (Before Tax, $)" value={netStr} onChange={setNetStr} id="st-n" />
          <RetroInput label="Sales Tax Rate (%)" value={rateStr} onChange={setRateStr} id="st-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Sales Tax Amount" value={results.tax.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
              <ResultDisplay label="Gross Total (with tax)" value={results.gross.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
