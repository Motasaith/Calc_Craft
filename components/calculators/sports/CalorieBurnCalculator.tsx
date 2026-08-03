'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CalorieBurnCalculator() {
  const [weightStr, setWeightStr] = useState('150') // lbs
  const [durationStr, setDurationStr] = useState('30') // mins
  const [metStr, setMetStr] = useState('8') // jogging METs

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, calories: 0, steps: [] as string[] }
    const w = parseFloat(weightStr)
    const d = parseFloat(durationStr)
    const met = parseFloat(metStr)

    if (isNaN(w) || isNaN(d) || isNaN(met) || w <= 0 || d <= 0 || met <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const weightKg = w * 0.453592
    const calories = d * (met * 3.5 * weightKg) / 200

    return {
      error: null,
      calories,
      steps: [
        `Weight = ${w} lbs (${weightKg.toFixed(1)} kg)`,
        `Formula: Calories = Time (mins) × (MET × 3.5 × Weight_kg) / 200`,
        `Calories Burned = ${calories.toFixed(1)} kcal`
      ]
    }
  }, [weightStr, durationStr, metStr])

  return (
    <FormCalculatorShell title="Calories Burned Solver" subtitle="Calculate active calories burned during workouts using MET rates" badge="SPORTS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Body Weight (lbs)" value={weightStr} onChange={setWeightStr} id="cb-w" />
          <RetroInput label="Exercise Duration (minutes)" value={durationStr} onChange={setDurationStr} id="cb-d" />
          <RetroInput label="Activity MET rate (e.g. walk=3, run=8)" value={metStr} onChange={setMetStr} id="cb-met" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Calories Burned (kcal)" value={results.calories.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
