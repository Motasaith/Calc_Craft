'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CashOnCashCalculator() {
  const [cashFlowStr, setCashFlowStr] = useState('5000') // annual cash flow
  const [investedStr, setInvestedStr] = useState('50000') // cash invested

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, coc: 0 }
    const cf = parseFloat(cashFlowStr)
    const inv = parseFloat(investedStr)

    if (isNaN(cf) || isNaN(inv) || inv <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const coc = (cf / inv) * 100
    return { error: null, coc }
  }, [cashFlowStr, investedStr])

  return (
    <FormCalculatorShell title="Cash-on-Cash Return Solver" subtitle="Calculate cash yield percentages on invested real estate capital" badge="REAL ESTATE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Annual Cash Flow ($)" value={cashFlowStr} onChange={setCashFlowStr} id="coc-c" />
          <RetroInput label="Total Invested Equity Cash ($)" value={investedStr} onChange={setInvestedStr} id="coc-i" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Cash-on-Cash Return" value={`${results.coc.toFixed(2)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
