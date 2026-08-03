'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DayCounter() {
  const [startStr, setStartStr] = useState('2026-08-03')
  const [endStr, setEndStr] = useState('2026-09-03')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, count: 0 }
    const d1 = new Date(startStr)
    const d2 = new Date(endStr)

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return { ...defaultObj, error: 'Please enter valid dates.' }
    }

    const diffTime = d2.getTime() - d1.getTime()
    const count = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return { error: null, count }
  }, [startStr, endStr])

  return (
    <FormCalculatorShell title="Calendar Days Count Solver" subtitle="Calculate total elapsed calendar days between two dates" badge="DATE-TIME">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Start Date (YYYY-MM-DD)" value={startStr} onChange={setStartStr} id="dcn-s" />
          <RetroInput label="End Date (YYYY-MM-DD)" value={endStr} onChange={setEndStr} id="dcn-e" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Days Elapsed" value={`${results.count} days`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
