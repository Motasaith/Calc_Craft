'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CarbohydrateCalculator() {
  const [caloriesStr, setCaloriesStr] = useState('2000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, low: 0, high: 0 }
    const cal = parseFloat(caloriesStr)
    if (isNaN(cal) || cal <= 0) return { ...defaultObj, error: 'Please enter valid calories.' }
    // 45% to 65% of total calories from carbs. Carbs have 4 calories/gram.
    const low = (cal * 0.45) / 4
    const high = (cal * 0.65) / 4
    return { error: null, low, high }
  }, [caloriesStr])

  return (
    <FormCalculatorShell title="Daily Carbohydrates Solver" subtitle="Calculate recommended daily carbohydrate grams based on calorie targets" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Daily Calorie Intake Target" value={caloriesStr} onChange={setCaloriesStr} id="carb-c" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Min Carbs (grams)" value={`${results.low.toFixed(1)}g`} large />
              <ResultDisplay label="Max Carbs (grams)" value={`${results.high.toFixed(1)}g`} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
