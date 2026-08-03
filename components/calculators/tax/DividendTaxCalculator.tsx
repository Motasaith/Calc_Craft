'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DividendTaxCalculator() {
  const [dividendStr, setDividendStr] = useState('5000')
  const [rateStr, setRateStr] = useState('15') // % dividend tax rate

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, tax: 0 }
    const div = parseFloat(dividendStr)
    const rate = parseFloat(rateStr)

    if (isNaN(div) || isNaN(rate) || div < 0 || rate < 0 || rate > 100) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const tax = div * (rate / 100)
    return { error: null, tax }
  }, [dividendStr, rateStr])

  return (
    <FormCalculatorShell title="Dividend Tax Solver" subtitle="Calculate tax rates and obligations on qualified dividend income" badge="TAX">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Dividends ($)" value={dividendStr} onChange={setDividendStr} id="dt-d" />
          <RetroInput label="Dividend Tax Rate (%)" value={rateStr} onChange={setRateStr} id="dt-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Dividend Tax Owed" value={results.tax.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
