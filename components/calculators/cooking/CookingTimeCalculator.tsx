'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CookingTimeCalculator() {
  const [weightStr, setWeightStr] = useState('5') // lbs
  const [minsPerLbStr, setMinsPerLbStr] = useState('20')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, totalMins: 0 }
    const w = parseFloat(weightStr)
    const m = parseFloat(minsPerLbStr)

    if (isNaN(w) || isNaN(m) || w <= 0 || m <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const totalMins = w * m
    return { error: null, totalMins }
  }, [weightStr, minsPerLbStr])

  return (
    <FormCalculatorShell title="Cooking Time Solver" subtitle="Calculate total oven roasting times based on meat weights" badge="COOKING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Meat Weight (lbs)" value={weightStr} onChange={setWeightStr} id="ct-w" />
          <RetroInput label="Minutes per Pound" value={minsPerLbStr} onChange={setMinsPerLbStr} id="ct-m" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Total Cooking Time" value={`${results.totalMins.toFixed(0)} minutes`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
