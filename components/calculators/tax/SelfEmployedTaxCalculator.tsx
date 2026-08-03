'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SelfEmployedTaxCalculator() {
  const [netProfitStr, setNetProfitStr] = useState('75000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, seTax: 0 }
    const profit = parseFloat(netProfitStr)
    if (isNaN(profit) || profit < 0) return { ...defaultObj, error: 'Please enter valid net profits.' }
    // SE tax base: 92.35% of profit is subject to 15.3% tax rate
    const taxableIncome = profit * 0.9235
    const seTax = taxableIncome * 0.153
    return { error: null, seTax }
  }, [netProfitStr])

  return (
    <FormCalculatorShell title="Self-Employment Tax Solver" subtitle="Calculate estimated 15.3% SE tax liabilities on net profits" badge="TAX">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Net business Profit ($)" value={netProfitStr} onChange={setNetProfitStr} id="se-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="SE Tax Owed" value={results.seTax.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
