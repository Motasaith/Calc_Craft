'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WaterIntakeSportsCalculator() {
  const [weightStr, setWeightStr] = useState('150') // lbs
  const [exerciseStr, setExerciseStr] = useState('60') // minutes

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ounces: 0 }
    const w = parseFloat(weightStr)
    const ex = parseFloat(exerciseStr)

    if (isNaN(w) || isNaN(ex) || w <= 0 || ex < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // Baseline: 0.5 oz per lb of body weight. Add 12 oz for every 30 minutes of exercise.
    const ounces = w * 0.5 + (ex / 30) * 12
    return { error: null, ounces }
  }, [weightStr, exerciseStr])

  return (
    <FormCalculatorShell title="Active Water Intake Solver" subtitle="Calculate recommended daily hydration ounces for athletes" badge="SPORTS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Body Weight (lbs)" value={weightStr} onChange={setWeightStr} id="wis-w" />
          <RetroInput label="Daily Exercise Time (minutes)" value={exerciseStr} onChange={setExerciseStr} id="wis-e" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Hydration Target (oz)" value={`${results.ounces.toFixed(1)} oz`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
