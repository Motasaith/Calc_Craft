'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CurrencyConverter() {
  const [usdStr, setUsdStr] = useState('100')
  const [rateStr, setRateStr] = useState('0.92') // USD to EUR conversion rate

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, converted: 0 }
    const usd = parseFloat(usdStr)
    const rate = parseFloat(rateStr)

    if (isNaN(usd) || isNaN(rate) || usd < 0 || rate <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const converted = usd * rate
    return { error: null, converted }
  }, [usdStr, rateStr])

  return (
    <FormCalculatorShell title="Foreign Currency Converter" subtitle="Convert base USD currencies to major target exchange rates" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Amount in USD ($)" value={usdStr} onChange={setUsdStr} id="cc-u" />
          <RetroInput label="Exchange Conversion Rate" value={rateStr} onChange={setRateStr} id="cc-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Converted Amount" value={results.converted.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
