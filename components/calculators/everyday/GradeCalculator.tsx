'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GradeCalculator() {
  const [currentStr, setCurrentStr] = useState('85')
  const [targetStr, setTargetStr] = useState('90')
  const [weightStr, setWeightStr] = useState('20') // final weight %

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, finalScore: 0 }
    const cur = parseFloat(currentStr)
    const tgt = parseFloat(targetStr)
    const wt = parseFloat(weightStr)

    if (isNaN(cur) || isNaN(tgt) || isNaN(wt) || wt <= 0 || wt >= 100) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const finalScore = (tgt - cur * (1 - wt / 100)) / (wt / 100)
    return { error: null, finalScore }
  }, [currentStr, targetStr, weightStr])

  return (
    <FormCalculatorShell title="Final Grade Solver" subtitle="Calculate score needed on final exam to reach target grades" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Current Class Grade (%)" value={currentStr} onChange={setCurrentStr} id="gr-c" />
          <RetroInput label="Target Grade desired (%)" value={targetStr} onChange={setTargetStr} id="gr-t" />
          <RetroInput label="Final Exam Weight (%)" value={weightStr} onChange={setWeightStr} id="gr-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Required Final Exam Score" value={`${results.finalScore.toFixed(1)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
