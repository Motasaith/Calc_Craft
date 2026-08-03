'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ChildBMICalculator() {
  const [weightStr, setWeightStr] = useState('60') // lbs
  const [heightStr, setHeightStr] = useState('48') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, bmi: 0 }
    const w = parseFloat(weightStr)
    const h = parseFloat(heightStr)

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      return { ...defaultObj, error: 'Please enter valid dimensions.' }
    }

    const bmi = (w / (h * h)) * 703
    return { error: null, bmi }
  }, [weightStr, heightStr])

  return (
    <FormCalculatorShell title="Pediatric BMI Solver" subtitle="Calculate BMI values for children based on heights and weights" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Child Weight (lbs)" value={weightStr} onChange={setWeightStr} id="cbmi-w" />
          <RetroInput label="Child Height (inches)" value={heightStr} onChange={setHeightStr} id="cbmi-h" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Child BMI Value" value={results.bmi.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
