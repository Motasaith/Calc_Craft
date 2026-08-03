'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GroceryBudgetCalculator() {
  const [weeklyStr, setWeeklyStr] = useState('120')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, monthly: 0, daily: 0 }
    const w = parseFloat(weeklyStr)
    if (isNaN(w) || w < 0) return { ...defaultObj, error: 'Please enter a valid amount.' }
    const daily = w / 7
    const monthly = w * 4.333
    return { error: null, monthly, daily }
  }, [weeklyStr])

  return (
    <FormCalculatorShell title="Grocery Budget Solver" subtitle="Split weekly grocery allowances into monthly and daily rates" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Weekly Grocery Spending ($)" value={weeklyStr} onChange={setWeeklyStr} id="gb-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Daily Rate" value={results.daily.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
              <ResultDisplay label="Monthly Equivalent" value={results.monthly.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
