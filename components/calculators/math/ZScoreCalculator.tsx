'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ZScoreCalculator() {
  const [xStr, setXStr] = useState('85')
  const [meanStr, setMeanStr] = useState('75')
  const [sdStr, setSdStr] = useState('8')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      zScore: 0,
      percentile: 0,
      steps: [] as string[]
    }

    const x = parseFloat(xStr)
    const mean = parseFloat(meanStr)
    const sd = parseFloat(sdStr)

    if (isNaN(x) || isNaN(mean) || isNaN(sd) || sd <= 0) {
      return { ...defaultObj, error: 'Please enter valid numbers (SD must be positive).' }
    }

    const zScore = (x - mean) / sd
    
    // Normal distribution approximation (error function)
    const t = 1 / (1 + 0.2316419 * Math.abs(zScore))
    const d = 0.39894228 * Math.exp(-zScore * zScore / 2)
    const prob = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
    const percentile = zScore >= 0 ? (1 - prob) * 100 : prob * 100

    const steps = [
      `z = (x - μ) / σ`,
      `z = (${x} - ${mean}) / ${sd}`,
      `z = ${x - mean} / ${sd} = ${zScore.toFixed(4)}`,
      `Percentile = ${percentile.toFixed(2)}%`
    ]

    return {
      error: null,
      zScore,
      percentile,
      steps
    }
  }, [xStr, meanStr, sdStr])

  return (
    <FormCalculatorShell title="Z-Score Calculator" subtitle="Find normal distribution z-score and probability percentile" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Observed Value (x)" value={xStr} onChange={setXStr} id="z-x" />
          <RetroInput label="Mean (μ)" value={meanStr} onChange={setMeanStr} id="z-mean" />
          <RetroInput label="Std Dev (σ)" value={sdStr} onChange={setSdStr} id="z-sd" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Z-Score" value={results.zScore.toFixed(4)} large />
                <ResultDisplay label="Percentile" value={`${results.percentile.toFixed(2)}%`} large />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Mathematical Steps</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results.error}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
