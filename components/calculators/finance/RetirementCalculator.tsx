'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RetirementCalculator() {
  const [ageStr, setAgeStr] = useState('30')
  const [targetAgeStr, setTargetAgeStr] = useState('65')
  const [savingsStr, setSavingsStr] = useState('50000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, years: 0, futureValue: 0 }
    const age = parseInt(ageStr)
    const target = parseInt(targetAgeStr)
    const savings = parseFloat(savingsStr)

    if (isNaN(age) || isNaN(target) || isNaN(savings) || target <= age || savings < 0) {
      return { ...defaultObj, error: 'Please enter valid ages and savings.' }
    }

    const years = target - age
    // Assume simple 6% annual growth
    const futureValue = savings * Math.pow(1 + 0.06, years)

    return { error: null, years, futureValue }
  }, [ageStr, targetAgeStr, savingsStr])

  return (
    <FormCalculatorShell title="Retirement Capital Growth Solver" subtitle="Estimate compounding retirement savings using 6% average returns" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Current Age" value={ageStr} onChange={setAgeStr} id="ret-a" />
          <RetroInput label="Target Retirement Age" value={targetAgeStr} onChange={setTargetAgeStr} id="ret-t" />
          <RetroInput label="Current Retirement Balance ($)" value={savingsStr} onChange={setSavingsStr} id="ret-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Accrual Years Remaining" value={results.years.toString()} />
              <ResultDisplay label="Projected Future Value (6%)" value={results.futureValue.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
