'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ChurnRateCalculator() {
  const [lostStr, setLostStr] = useState('5') // lost customers
  const [startStr, setStartStr] = useState('100') // starting customers

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, churn: 0 }
    const lost = parseFloat(lostStr)
    const start = parseFloat(startStr)

    if (isNaN(lost) || isNaN(start) || lost < 0 || start <= 0 || lost > start) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const churn = (lost / start) * 100
    return { error: null, churn }
  }, [lostStr, startStr])

  return (
    <FormCalculatorShell title="Customer Churn Rate Solver" subtitle="Calculate percentage customer churn rates over interval periods" badge="BUSINESS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Lost Customers during period" value={lostStr} onChange={setLostStr} id="cr-l" />
          <RetroInput label="Starting Customers count" value={startStr} onChange={setStartStr} id="cr-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Churn Rate Percentage" value={`${results.churn.toFixed(2)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
