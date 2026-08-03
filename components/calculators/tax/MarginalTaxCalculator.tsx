'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MarginalTaxCalculator() {
  const [incomeStr, setIncomeStr] = useState('85000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, effective: 0 }
    const income = parseFloat(incomeStr)
    if (isNaN(income) || income < 0) return { ...defaultObj, error: 'Please enter a valid income.' }
    // Single filer simple brackets: 10% up to $11,600, 12% up to $47,150, 22% above
    let tax = 0
    if (income <= 11600) {
      tax = income * 0.10
    } else if (income <= 47150) {
      tax = 1160 + (income - 11600) * 0.12
    } else {
      tax = 1160 + 4266 + (income - 47150) * 0.22
    }
    const effective = income > 0 ? (tax / income) * 100 : 0
    return { error: null, effective }
  }, [incomeStr])

  return (
    <FormCalculatorShell title="Marginal vs Effective Tax Solver" subtitle="Calculate average tax rates based on federal brackets" badge="TAX">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Taxable Income ($)" value={incomeStr} onChange={setIncomeStr} id="mt-i" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Effective Tax Rate" value={`${results.effective.toFixed(2)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
