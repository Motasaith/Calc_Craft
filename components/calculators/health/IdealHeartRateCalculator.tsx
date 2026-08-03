'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function IdealHeartRateCalculator() {
  const [ageStr, setAgeStr] = useState('30')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, low: 0, high: 0 }
    const age = parseInt(ageStr)
    if (isNaN(age) || age <= 0) return { ...defaultObj, error: 'Please enter a valid age.' }
    const maxHr = 220 - age
    const low = maxHr * 0.50
    const high = maxHr * 0.85
    return { error: null, low, high }
  }, [ageStr])

  return (
    <FormCalculatorShell title="Target Heart Rate Solver" subtitle="Calculate ideal heart rate boundaries for workouts" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Age" value={ageStr} onChange={setAgeStr} id="ihr-age" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="50% Intensity" value={`${Math.round(results.low)} bpm`} large />
              <ResultDisplay label="85% Intensity" value={`${Math.round(results.high)} bpm`} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
