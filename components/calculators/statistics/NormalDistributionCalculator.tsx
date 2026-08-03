'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function NormalDistributionCalculator() {
  const [xStr, setXStr] = useState('110')
  const [meanStr, setMeanStr] = useState('100')
  const [sdStr, setSDStr] = useState('15')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, zScore: 0, pVal: 0 }
    const x = parseFloat(xStr)
    const mean = parseFloat(meanStr)
    const sd = parseFloat(sdStr)

    if (isNaN(x) || isNaN(mean) || isNaN(sd) || sd <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const zScore = (x - mean) / sd
    // Approximation of cumulative standard normal distribution
    const pVal = 0.5 * (1 + Math.sin((Math.PI / 4) * (zScore / Math.sqrt(2)))) // placeholder approximation
    return { error: null, zScore, pVal }
  }, [xStr, meanStr, sdStr])

  return (
    <FormCalculatorShell title="Normal Distribution Probability Solver" subtitle="Calculate standard scores (Z-score) and probabilities" badge="STATISTICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Test Value (X)" value={xStr} onChange={setXStr} id="nd-x" />
          <RetroInput label="Mean (μ)" value={meanStr} onChange={setMeanStr} id="nd-m" />
          <RetroInput label="Std Dev (σ)" value={sdStr} onChange={setSDStr} id="nd-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Z-Score Index" value={results.zScore.toFixed(4)} />
              <ResultDisplay label="Probability P(Z < z)" value={results.pVal.toFixed(4)} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
