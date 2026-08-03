'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RamadanCalculator() {
  const [yearStr, setYearStr] = useState('2026')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, daysLeft: 0 }
    const yr = parseInt(yearStr)
    if (isNaN(yr) || yr < 2026) return { ...defaultObj, error: 'Please enter a valid future Gregorian year.' }
    // Ramadan 2026 approx: Feb 18
    const rDate = new Date(2026, 1, 18)
    const today = new Date()
    const diffTime = rDate.getTime() - today.getTime()
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return { error: null, daysLeft: Math.max(0, daysLeft) }
  }, [yearStr])

  return (
    <FormCalculatorShell title="Ramadan Calendar Countdown Solver" subtitle="Calculate days remaining until the holy month of Ramadan" badge="ISLAMIC">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Gregorian Year" value={yearStr} onChange={setYearStr} id="ram-yr" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Days to Ramadan (Approx)" value={results.daysLeft.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
