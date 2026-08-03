'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HoursCalculator() {
  const [startStr, setStartStr] = useState('09:00')
  const [endStr, setEndStr] = useState('17:00')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, hours: 0 }
    if (!startStr || !endStr) return { ...defaultObj, error: 'Please enter both times.' }
    const [sh, sm] = startStr.split(':').map(Number)
    const [eh, em] = endStr.split(':').map(Number)
    if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return { ...defaultObj, error: 'Invalid time format.' }
    
    let diffMins = (eh * 60 + em) - (sh * 60 + sm)
    if (diffMins < 0) diffMins += 24 * 60 // wrap next day
    const hours = diffMins / 60
    return { error: null, hours }
  }, [startStr, endStr])

  return (
    <FormCalculatorShell title="Hours Worked Clock Solver" subtitle="Calculate elapsed hours between starting and ending clock times" badge="DATE-TIME">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Start Time (HH:MM)" value={startStr} onChange={setStartStr} id="hr-s" />
          <RetroInput label="End Time (HH:MM)" value={endStr} onChange={setEndStr} id="hr-e" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Total Hours Worked" value={`${results.hours.toFixed(2)} hours`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
