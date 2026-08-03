'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DividendYieldCalculator() {
  const [dividendStr, setDividendStr] = useState('2.50') // annual dividend per share
  const [priceStr, setPriceStr] = useState('50.00') // share price

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, yieldPct: 0 }
    const div = parseFloat(dividendStr)
    const price = parseFloat(priceStr)

    if (isNaN(div) || isNaN(price) || div < 0 || price <= 0) {
      return { ...defaultObj, error: 'Please enter valid dividend values.' }
    }

    const yieldPct = (div / price) * 100
    return { error: null, yieldPct }
  }, [dividendStr, priceStr])

  return (
    <FormCalculatorShell title="Dividend Yield Solver" subtitle="Calculate stock dividend yields from share prices" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Annual Dividend per Share ($)" value={dividendStr} onChange={setDividendStr} id="dy-d" />
          <RetroInput label="Share Price ($)" value={priceStr} onChange={setPriceStr} id="dy-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Dividend Yield" value={`${results.yieldPct.toFixed(2)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
