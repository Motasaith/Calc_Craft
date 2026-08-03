'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MortgageAffordabilityCalculator() {
  const [incomeStr, setIncomeStr] = useState('75000') // annual gross income
  const [debtsStr, setDebtsStr] = useState('500') // monthly debts

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, affordPayment: 0 }
    const inc = parseFloat(incomeStr)
    const debts = parseFloat(debtsStr)

    if (isNaN(inc) || isNaN(debts) || inc <= 0 || debts < 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    // Standard 28/36 rule: monthly mortgage payment should not exceed 28% of gross monthly income
    const grossMonthly = inc / 12
    const affordPayment = grossMonthly * 0.28
    return { error: null, affordPayment }
  }, [incomeStr, debtsStr])

  return (
    <FormCalculatorShell title="Mortgage Affordability Solver" subtitle="Estimate affordable monthly mortgage payments based on income limits" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Gross Annual Income ($)" value={incomeStr} onChange={setIncomeStr} id="ma-i" />
          <RetroInput label="Monthly Debt Payments ($)" value={debtsStr} onChange={setDebtsStr} id="ma-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Affordable Monthly Payment" value={results.affordPayment.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
