'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WilksScoreCalculator() {
  const [liftedStr, setLiftedStr] = useState('1000') // lbs
  const [weightStr, setWeightStr] = useState('180') // lbs

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, score: 0 }
    const lifted = parseFloat(liftedStr)
    const w = parseFloat(weightStr)

    if (isNaN(lifted) || isNaN(w) || lifted <= 0 || w <= 0) {
      return { ...defaultObj, error: 'Please enter valid weights.' }
    }

    const wKg = w * 0.453592
    const lKg = lifted * 0.453592

    // Wilks coefficients for males
    const a = -216.0475144
    const b = 16.2606339
    const c = -0.002388645
    const d = -0.00113732
    const e = 0.00000701863
    const f = -0.00000001291

    const denom = a + b * wKg + c * Math.pow(wKg, 2) + d * Math.pow(wKg, 3) + e * Math.pow(wKg, 4) + f * Math.pow(wKg, 5)
    if (denom === 0) return { ...defaultObj, error: 'Calculation limits reached.' }
    const score = lKg * (500 / denom)

    return { error: null, score }
  }, [liftedStr, weightStr])

  return (
    <FormCalculatorShell title="Wilks Coefficient Score Solver" subtitle="Calculate Wilks powerlifting strength index coefficients" badge="SPORTS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Weight Lifted (lbs)" value={liftedStr} onChange={setLiftedStr} id="ws-l" />
          <RetroInput label="Body Weight (lbs)" value={weightStr} onChange={setWeightStr} id="ws-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Wilks Score" value={results.score.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
