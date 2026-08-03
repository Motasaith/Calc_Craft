'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ScreenTimeCalculator() {
  const [hoursStr, setHoursStr] = useState('4') // daily hours

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, yearlyDays: 0 }
    const h = parseFloat(hoursStr)
    if (isNaN(h) || h < 0 || h > 24) {
      return { ...defaultObj, error: 'Hours must be between 0 and 24.' }
    }
    const yearlyDays = (h * 365.25) / 24
    return { error: null, yearlyDays }
  }, [hoursStr])

  return (
    <FormCalculatorShell title="Screen Time Annual Impact Solver" subtitle="Convert daily screen time hours into annual days equivalents" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Daily Screen Usage (Hours)" value={hoursStr} onChange={setHoursStr} id="st-h" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Total Days per Year Spent" value={`${results.yearlyDays.toFixed(1)} days`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
