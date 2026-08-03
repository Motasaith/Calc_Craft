'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BenchPressRatioCalculator() {
  const [benchStr, setBenchStr] = useState('150') // lbs
  const [weightStr, setWeightStr] = useState('150') // lbs

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ratio: 0 }
    const bench = parseFloat(benchStr)
    const weight = parseFloat(weightStr)

    if (isNaN(bench) || isNaN(weight) || bench <= 0 || weight <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const ratio = bench / weight
    return { error: null, ratio }
  }, [benchStr, weightStr])

  return (
    <FormCalculatorShell title="Bench Press Strength-to-Weight Solver" subtitle="Calculate your strength-to-weight ratio for the bench press" badge="SPORTS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Bench Press 1RM (lbs)" value={benchStr} onChange={setBenchStr} id="bpr-b" />
          <RetroInput label="Body Weight (lbs)" value={weightStr} onChange={setWeightStr} id="bpr-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Strength Ratio" value={results.ratio.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
