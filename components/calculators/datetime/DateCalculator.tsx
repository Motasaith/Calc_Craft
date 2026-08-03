'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DateCalculator() {
  const [startStr, setStartStr] = useState('2026-08-03')
  const [daysStr, setDaysStr] = useState('30')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, targetDate: '' }
    const date = new Date(startStr)
    const offset = parseInt(daysStr)

    if (isNaN(date.getTime()) || isNaN(offset)) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    date.setDate(date.getDate() + offset)
    const targetDate = date.toISOString().split('T')[0]
    return { error: null, targetDate }
  }, [startStr, daysStr])

  return (
    <FormCalculatorShell title="Date Offset Calculator" subtitle="Add or subtract offset days from a starting calendar date" badge="DATE-TIME">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Start Date (YYYY-MM-DD)" value={startStr} onChange={setStartStr} id="dc-s" />
          <RetroInput label="Add Days (negative to subtract)" value={daysStr} onChange={setDaysStr} id="dc-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Target Date" value={results.targetDate} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
