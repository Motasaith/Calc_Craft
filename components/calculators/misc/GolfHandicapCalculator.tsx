'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GolfHandicapCalculator() {
  const [scoreStr, setScoreStr] = useState('85')
  const [ratingStr, setRatingStr] = useState('71.2') // course rating
  const [slopeStr, setSlopeStr] = useState('113') // slope rating

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, differential: 0 }
    const score = parseFloat(scoreStr)
    const rating = parseFloat(ratingStr)
    const slope = parseFloat(slopeStr)

    if (isNaN(score) || isNaN(rating) || isNaN(slope) || slope <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const differential = ((score - rating) * 113) / slope
    return { error: null, differential }
  }, [scoreStr, ratingStr, slopeStr])

  return (
    <FormCalculatorShell title="Golf Handicap Differential Solver" subtitle="Calculate your golf score handicap differential index" badge="MISCELLANEOUS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Gross Score" value={scoreStr} onChange={setScoreStr} id="gh-sc" />
          <RetroInput label="Course Rating" value={ratingStr} onChange={setRatingStr} id="gh-rt" />
          <RetroInput label="Slope Rating" value={slopeStr} onChange={setSlopeStr} id="gh-sl" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Handicap Differential" value={results.differential.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
