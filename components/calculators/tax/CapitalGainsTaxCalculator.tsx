'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CapitalGainsTaxCalculator() {
  const [gainStr, setGainStr] = useState('10000')
  const [rateStr, setRateStr] = useState('15') // % capital gains rate

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, tax: 0 }
    const gain = parseFloat(gainStr)
    const rate = parseFloat(rateStr)

    if (isNaN(gain) || isNaN(rate) || gain < 0 || rate < 0 || rate > 100) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const tax = gain * (rate / 100)
    return { error: null, tax }
  }, [gainStr, rateStr])

  return (
    <FormCalculatorShell title="Capital Gains Tax Solver" subtitle="Calculate short or long-term capital gains tax obligations" badge="TAX">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Capital Gain ($)" value={gainStr} onChange={setGainStr} id="cgt-g" />
          <RetroInput label="Tax Rate (%)" value={rateStr} onChange={setRateStr} id="cgt-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Tax Obligation" value={results.tax.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
