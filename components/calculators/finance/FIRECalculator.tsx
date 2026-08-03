'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FIRECalculator() {
  const [expenseStr, setExpenseStr] = useState('40000') // yearly expenses

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, fireNumber: 0 }
    const expenses = parseFloat(expenseStr)

    if (isNaN(expenses) || expenses <= 0) {
      return { ...defaultObj, error: 'Please enter valid annual expenses.' }
    }

    const fireNumber = expenses * 25 // 4% rule of thumb
    return { error: null, fireNumber }
  }, [expenseStr])

  return (
    <FormCalculatorShell title="FIRE Milestone Solver" subtitle="Estimate financial independence capital targets using the 4% safe withdrawal rule" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Annual Living Expenses ($)" value={expenseStr} onChange={setExpenseStr} id="fire-e" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="FIRE Target Amount" value={results.fireNumber.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
