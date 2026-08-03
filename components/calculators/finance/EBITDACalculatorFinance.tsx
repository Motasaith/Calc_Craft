'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function EBITDACalculatorFinance() {
  const [netIncomeStr, setNetIncomeStr] = useState('80000')
  const [interestStr, setInterestStr] = useState('5000')
  const [taxesStr, setTaxesStr] = useState('15000')
  const [depAmortStr, setDepAmortStr] = useState('10000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ebitda: 0 }
    const net = parseFloat(netIncomeStr)
    const intr = parseFloat(interestStr)
    const tax = parseFloat(taxesStr)
    const da = parseFloat(depAmortStr)

    if (isNaN(net) || isNaN(intr) || isNaN(tax) || isNaN(da)) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const ebitda = net + intr + tax + da
    return { error: null, ebitda }
  }, [netIncomeStr, interestStr, taxesStr, depAmortStr])

  return (
    <FormCalculatorShell title="EBITDA Profitability Solver" subtitle="Calculate core EBITDA earnings by adding back non-operating parameters" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Net Income ($)" value={netIncomeStr} onChange={setNetIncomeStr} id="ebf-n" />
            <RetroInput label="Interest Expenses ($)" value={interestStr} onChange={setInterestStr} id="ebf-i" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Income Taxes Paid ($)" value={taxesStr} onChange={setTaxesStr} id="ebf-t" />
            <RetroInput label="Depreciation & Amortization ($)" value={depAmortStr} onChange={setDepAmortStr} id="ebf-d" />
          </div>
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="EBITDA Earnings" value={results.ebitda.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
