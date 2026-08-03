'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SavingsGoalCalculator() {
  const [targetStr, setTargetStr] = useState('50000')
  const [yearsStr, setYearsStr] = useState('10')
  const [rateStr, setRateStr] = useState('5')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, monthly: 0 }
    const t = parseFloat(targetStr)
    const y = parseFloat(yearsStr)
    const r = parseFloat(rateStr)

    if (isNaN(t) || isNaN(y) || isNaN(r) || t <= 0 || y <= 0 || r < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const months = y * 12
    const monthlyRate = (r / 100) / 12
    const monthly = monthlyRate > 0
      ? (t * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)
      : t / months

    return { error: null, monthly }
  }, [targetStr, yearsStr, rateStr])

  return (
    <FormCalculatorShell title="Savings Goal Solver" subtitle="Calculate monthly savings deposits to reach goals" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Target Savings Sum ($)" value={targetStr} onChange={setTargetStr} id="sg-t" />
          <RetroInput label="Duration (Years)" value={yearsStr} onChange={setYearsStr} id="sg-y" />
          <RetroInput label="Annual Return Rate (APY %)" value={rateStr} onChange={setRateStr} id="sg-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Monthly Deposit Needed" value={results.monthly.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
