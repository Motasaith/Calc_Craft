'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PetFoodCalculator() {
  const [weightStr, setWeightStr] = useState('15') // pet weight lbs

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, cups: 0 }
    const w = parseFloat(weightStr)
    if (isNaN(w) || w <= 0) return { ...defaultObj, error: 'Please enter valid weights.' }
    // General rule of thumb: 1/3 cup of dry food per 5 lbs of weight
    const cups = (w / 5) * 0.333
    return { error: null, cups }
  }, [weightStr])

  return (
    <FormCalculatorShell title="Pet Feeding Portion Solver" subtitle="Estimate daily dry food cup portions based on weights" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Pet Weight (lbs)" value={weightStr} onChange={setWeightStr} id="pfc-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Daily Portion (Cups)" value={`sm${results.cups.toFixed(1)} cups`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
