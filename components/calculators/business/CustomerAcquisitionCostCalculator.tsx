'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CustomerAcquisitionCostCalculator() {
  const [spendStr, setSpendStr] = useState('10000') // marketing cost
  const [customersStr, setCustomersStr] = useState('200') // customers acquired

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, cac: 0 }
    const spend = parseFloat(spendStr)
    const count = parseFloat(customersStr)

    if (isNaN(spend) || isNaN(count) || spend < 0 || count <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const cac = spend / count
    return { error: null, cac }
  }, [spendStr, customersStr])

  return (
    <FormCalculatorShell title="Customer Acquisition Cost CAC Solver" subtitle="Calculate marketing spend acquisition efficiency ratios" badge="BUSINESS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Marketing and Sales Spend ($)" value={spendStr} onChange={setSpendStr} id="cac-s" />
          <RetroInput label="New Customers Acquired" value={customersStr} onChange={setCustomersStr} id="cac-c" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="CAC Value Cost per Customer" value={results.cac.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
