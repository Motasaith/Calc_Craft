'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GradeCurveCalculator() {
  const [scoreStr, setScoreStr] = useState('64') // raw score out of 100

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, curved: 0 }
    const raw = parseFloat(scoreStr)
    if (isNaN(raw) || raw < 0 || raw > 100) return { ...defaultObj, error: 'Please enter a raw score between 0 and 100.' }
    // Square Root Curve: curved = 10 * sqrt(raw)
    const curved = 10 * Math.sqrt(raw)
    return { error: null, curved }
  }, [scoreStr])

  return (
    <FormCalculatorShell title="Square Root Grade Curve Solver" subtitle="Calculate curved test scores using the square root method" badge="EDUCATION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Raw Score (0 to 100)" value={scoreStr} onChange={setScoreStr} id="gc-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Curved Grade Score" value={results.curved.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
