'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function IncomeTaxCalculator() {
  const [incomeStr, setIncomeStr] = useState('75000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, tax: 0, afterTax: 0 }
    const income = parseFloat(incomeStr)
    if (isNaN(income) || income < 0) return { ...defaultObj, error: 'Please enter valid income.' }
    // Simple federal income tax model (approx 2024 single filer brackets)
    let tax = 0
    if (income <= 11600) {
      tax = income * 0.10
    } else if (income <= 47150) {
      tax = 1160 + (income - 11600) * 0.12
    } else if (income <= 100525) {
      tax = 1160 + 4266 + (income - 47150) * 0.22
    } else {
      tax = 1160 + 4266 + 11742.5 + (income - 100525) * 0.24
    }
    const afterTax = income - tax
    return { error: null, tax, afterTax }
  }, [incomeStr])

  return (
    <FormCalculatorShell title="Income Tax Bracket Solver" subtitle="Estimate standard federal income taxes and net take-home pay" badge="TAX">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Gross Annual Income ($)" value={incomeStr} onChange={setIncomeStr} id="it-i" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Income Tax" value={results.tax.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
              <ResultDisplay label="Net Income (After-Tax)" value={results.afterTax.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
