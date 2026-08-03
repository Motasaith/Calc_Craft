'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SepticTankCalculator() {
  const [bedroomsStr, setBedroomsStr] = useState('3')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, gallons: 0, steps: [] as string[] }
    const b = parseInt(bedroomsStr)
    if (isNaN(b) || b <= 0) return { ...defaultObj, error: 'Please enter a valid count of bedrooms.' }
    // Standard rule: 1-3 bedrooms = 1000 gallons, 4 bedrooms = 1200 gallons, +250 per extra bedroom
    let gallons = 1000
    if (b === 4) gallons = 1200
    else if (b > 4) gallons = 1200 + (b - 4) * 250
    return {
      error: null,
      gallons,
      steps: [
        `US Standard guidelines: 1-3 bedrooms = 1000 gallons minimum`,
        `4 bedrooms = 1200 gallons`,
        `Each extra bedroom = +250 gallons`,
        `Recommended Septic Tank Capacity = ${gallons} gallons`
      ]
    }
  }, [bedroomsStr])

  return (
    <FormCalculatorShell title="Septic Tank Size Solver" subtitle="Estimate septic tank size requirements for residential homes" badge="PLUMBING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Bedrooms Count" value={bedroomsStr} onChange={setBedroomsStr} id="st-b" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Tank Capacity (gallons)" value={results.gallons.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
