'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DayOfWeekCalculator() {
  const [dateStr, setDateStr] = useState('2026-08-03')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, dayName: '' }
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return { ...defaultObj, error: 'Please enter a valid date.' }
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayName = days[date.getDay()]
    return { error: null, dayName }
  }, [dateStr])

  return (
    <FormCalculatorShell title="Day of Week Solver" subtitle="Determine the weekday name for any custom calendar date" badge="DATE-TIME">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Target Date (YYYY-MM-DD)" value={dateStr} onChange={setDateStr} id="dow-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Day of the Week" value={results.dayName} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
