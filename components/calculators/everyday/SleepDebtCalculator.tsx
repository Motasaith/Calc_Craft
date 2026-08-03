'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SleepDebtCalculator() {
  const [neededStr, setNeededStr] = useState('8') // hours target
  const [actualStr, setActualStr] = useState('6.5') // average actual hours

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, debt: 0 }
    const n = parseFloat(neededStr)
    const a = parseFloat(actualStr)

    if (isNaN(n) || isNaN(a) || n <= 0 || a <= 0) {
      return { ...defaultObj, error: 'Please enter valid hours.' }
    }

    const debt = Math.max(0, n - a) * 7 // weekly debt
    return { error: null, debt }
  }, [neededStr, actualStr])

  return (
    <FormCalculatorShell title="Weekly Sleep Debt Solver" subtitle="Calculate compounding weekly sleep hour deficiencies" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Target Sleep per Night (Hours)" value={neededStr} onChange={setNeededStr} id="sd-n" />
          <RetroInput label="Actual Average Sleep (Hours)" value={actualStr} onChange={setActualStr} id="sd-ac" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Weekly Sleep Hour Deficit" value={`${results.debt.toFixed(1)} hours/week`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
