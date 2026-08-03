'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function EBITDACalculator() {
  const [profitStr, setProfitStr] = useState('100000') // operating profit / EBIT
  const [depStr, setDepStr] = useState('15000') // depreciation
  const [amortStr, setAmortStr] = useState('5000') // amortization

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ebitda: 0 }
    const profit = parseFloat(profitStr)
    const dep = parseFloat(depStr)
    const amort = parseFloat(amortStr)

    if (isNaN(profit) || isNaN(dep) || isNaN(amort)) {
      return { ...defaultObj, error: 'Please enter valid values.' }
    }

    const ebitda = profit + dep + amort
    return { error: null, ebitda }
  }, [profitStr, depStr, amortStr])

  return (
    <FormCalculatorShell title="EBITDA Profitability Solver" subtitle="Calculate EBITDA cash flow metrics by adding back non-cash expenses" badge="BUSINESS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Operating Profit (EBIT, $)" value={profitStr} onChange={setProfitStr} id="eb-p" />
          <RetroInput label="Depreciation ($)" value={depStr} onChange={setDepStr} id="eb-d" />
          <RetroInput label="Amortization ($)" value={amortStr} onChange={setAmortStr} id="eb-a" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="EBITDA Valuation" value={results.ebitda.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
