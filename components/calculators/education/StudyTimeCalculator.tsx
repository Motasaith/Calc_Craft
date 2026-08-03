'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function StudyTimeCalculator() {
  const [creditsStr, setCreditsStr] = useState('15')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, low: 0, high: 0 }
    const c = parseFloat(creditsStr)
    if (isNaN(c) || c <= 0) return { ...defaultObj, error: 'Please enter valid credit hours.' }
    // Rule of thumb: 2 to 3 hours of studying per credit hour
    const low = c * 2
    const high = c * 3
    return { error: null, low, high }
  }, [creditsStr])

  return (
    <FormCalculatorShell title="Weekly Study Hours Solver" subtitle="Calculate recommended study hours based on credit loads" badge="EDUCATION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Course Credit Hours" value={creditsStr} onChange={setCreditsStr} id="st-cr" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Min Study (hrs/wk)" value={`${results.low.toFixed(0)}h`} />
              <ResultDisplay label="Max Study (hrs/wk)" value={`${results.high.toFixed(0)}h`} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
