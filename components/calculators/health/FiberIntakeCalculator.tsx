'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FiberIntakeCalculator() {
  const [caloriesStr, setCaloriesStr] = useState('2000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, fiber: 0 }
    const cal = parseFloat(caloriesStr)
    if (isNaN(cal) || cal <= 0) return { ...defaultObj, error: 'Please enter valid calories.' }
    // Rule of thumb: 14g of fiber per 1000 calories
    const fiber = (cal / 1000) * 14
    return { error: null, fiber }
  }, [caloriesStr])

  return (
    <FormCalculatorShell title="Daily Fiber Intake Solver" subtitle="Calculate recommended daily fiber grams based on calorie targets" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Daily Calorie Intake Target" value={caloriesStr} onChange={setCaloriesStr} id="fib-c" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Recommended Fiber" value={`${results.fiber.toFixed(1)} grams`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
