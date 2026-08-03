'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DebtToIncomeCalculator() {
  const [debtStr, setDebtStr] = useState('1500') // monthly debt
  const [incomeStr, setIncomeStr] = useState('5000') // monthly income

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, dti: 0 }
    const debt = parseFloat(debtStr)
    const inc = parseFloat(incomeStr)

    if (isNaN(debt) || isNaN(inc) || debt < 0 || inc <= 0) {
      return { ...defaultObj, error: 'Please enter valid income and debt parameters.' }
    }

    const dti = (debt / inc) * 100
    return { error: null, dti }
  }, [debtStr, incomeStr])

  return (
    <FormCalculatorShell title="Debt-to-Income DTI Solver" subtitle="Calculate monthly DTI ratio percentages" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Monthly Debt Obligations ($)" value={debtStr} onChange={setDebtStr} id="dti-d" />
          <RetroInput label="Gross Monthly Income ($)" value={incomeStr} onChange={setIncomeStr} id="dti-i" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="DTI Ratio" value={`${results.dti.toFixed(2)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
