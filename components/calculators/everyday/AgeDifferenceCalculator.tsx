'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AgeDifferenceCalculator() {
  const [b1, setB1] = useState('1990-01-01')
  const [b2, setB2] = useState('1995-06-15')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, diffYears: 0 }
    const d1 = new Date(b1)
    const d2 = new Date(b2)

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return { ...defaultObj, error: 'Please enter valid dates.' }
    }

    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    const diffYears = diffDays / 365.25

    return { error: null, diffYears }
  }, [b1, b2])

  return (
    <FormCalculatorShell title="Age Difference Solver" subtitle="Calculate age margins and date offsets between two birthdates" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Birth Date 1 (YYYY-MM-DD)" value={b1} onChange={setB1} id="ad-d1" />
          <RetroInput label="Birth Date 2 (YYYY-MM-DD)" value={b2} onChange={setB2} id="ad-d2" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Age Difference" value={`${results.diffYears.toFixed(1)} years`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
