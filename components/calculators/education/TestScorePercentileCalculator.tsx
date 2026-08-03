'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TestScorePercentileCalculator() {
  const [dataStr, setDataStr] = useState('60, 70, 80, 90, 95')
  const [scoreStr, setScoreStr] = useState('85')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, percentile: 0 }
    const arr = dataStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n)).sort((a, b) => a - b)
    const score = parseFloat(scoreStr)

    if (arr.length < 1 || isNaN(score)) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const below = arr.filter(x => x < score).length
    const equal = arr.filter(x => x === score).length
    const percentile = ((below + 0.5 * equal) / arr.length) * 100

    return { error: null, percentile }
  }, [dataStr, scoreStr])

  return (
    <FormCalculatorShell title="Exam Score Percentile Solver" subtitle="Determine score percentile standing rank among cohorts" badge="EDUCATION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Cohort Scores Array" value={dataStr} onChange={setDataStr} id="tsp-d" />
          <RetroInput label="Your Score" value={scoreStr} onChange={setScoreStr} id="tsp-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Standing Percentile Rank" value={`${results.percentile.toFixed(1)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
