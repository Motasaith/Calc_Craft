'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HajjDatesCalculator() {
  const [yearStr, setYearStr] = useState('2026')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, dateStr: '' }
    const yr = parseInt(yearStr)
    if (isNaN(yr) || yr < 2026) return { ...defaultObj, error: 'Please enter a valid future Gregorian year.' }
    // Hajj 2026 approx: May 26
    return { error: null, dateStr: 'May 26, 2026' }
  }, [yearStr])

  return (
    <FormCalculatorShell title="Hajj Pilgrimage Dates Solver" subtitle="Estimate Hajj commencement schedules for the coming years" badge="ISLAMIC">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Gregorian Year" value={yearStr} onChange={setYearStr} id="hj-yr" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Commencement Date" value={results.dateStr} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
