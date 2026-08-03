'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CryptoConverter() {
  const [btcStr, setBtcStr] = useState('1')
  const [rateStr, setRateStr] = useState('65000') // BTC to USD

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, value: 0 }
    const btc = parseFloat(btcStr)
    const rate = parseFloat(rateStr)

    if (isNaN(btc) || isNaN(rate) || btc < 0 || rate <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const value = btc * rate
    return { error: null, value }
  }, [btcStr, rateStr])

  return (
    <FormCalculatorShell title="Cryptocurrency Valuation Solver" subtitle="Convert crypto tokens to base USD equivalents" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="BTC Token Amount" value={btcStr} onChange={setBtcStr} id="cr-b" />
          <RetroInput label="BTC exchange spot rate ($)" value={rateStr} onChange={setRateStr} id="cr-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Equivalent USD Value" value={results.value.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
