'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function NetWorthCalculator() {
  const [assets, setAssets] = useState('250000')
  const [liabilities, setLiabilities] = useState('150000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, netWorth: 0 }
    const a = parseFloat(assets)
    const l = parseFloat(liabilities)

    if (isNaN(a) || isNaN(l) || a < 0 || l < 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const netWorth = a - l
    return { error: null, netWorth }
  }, [assets, liabilities])

  return (
    <FormCalculatorShell title="Net Worth Solver" subtitle="Calculate net personal wealth as assets minus liabilities" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Assets ($)" value={assets} onChange={setAssets} id="nw-a" />
          <RetroInput label="Total Liabilities ($)" value={liabilities} onChange={setLiabilities} id="nw-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Net Worth" value={results.netWorth.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
