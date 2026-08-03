'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RMRCalculator() {
  const [weightStr, setWeightStr] = useState('150') // lbs
  const [heightStr, setHeightStr] = useState('68') // inches
  const [ageStr, setAgeStr] = useState('30')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, rmr: 0 }
    const w = parseFloat(weightStr)
    const h = parseFloat(heightStr)
    const a = parseFloat(ageStr)

    if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // Mifflin-St Jeor equation for males approx
    const wKg = w * 0.453592
    const hCm = h * 2.54
    const rmr = 10 * wKg + 6.25 * hCm - 5 * a + 5

    return { error: null, rmr }
  }, [weightStr, heightStr, ageStr])

  return (
    <FormCalculatorShell title="Resting Metabolic Rate Solver" subtitle="Calculate RMR calories using Mifflin-St Jeor equations" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Weight (lbs)" value={weightStr} onChange={setWeightStr} id="rmr-w" />
          <RetroInput label="Height (inches)" value={heightStr} onChange={setHeightStr} id="rmr-h" />
          <RetroInput label="Age (years)" value={ageStr} onChange={setAgeStr} id="rmr-a" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Resting Calories (RMR)" value={`${Math.round(results.rmr)} kcal/day`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
