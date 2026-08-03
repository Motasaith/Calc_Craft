'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function StandardDeviationCalculator() {
  const [data, setData] = useState('10, 12, 23, 23, 16, 23, 21, 16')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      mean: 0,
      sdSample: 0,
      sdPop: 0,
      steps: [] as string[]
    }

    const nums = data.split(/[,\s]+/).map(Number).filter(n => !isNaN(n))
    if (nums.length < 2) {
      return { ...defaultObj, error: 'Please enter at least 2 numbers.' }
    }

    const n = nums.length
    const mean = nums.reduce((a, b) => a + b, 0) / n
    const sqDiffSum = nums.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0)

    const sdSample = Math.sqrt(sqDiffSum / (n - 1))
    const sdPop = Math.sqrt(sqDiffSum / n)

    const steps = [
      `Count (n) = ${n}`,
      `Mean (μ) = ${mean.toFixed(4)}`,
      `Sum of Squared Differences = ${sqDiffSum.toFixed(4)}`,
      `Sample SD (s) = √(Sum of SqDiff / (n - 1)) = ${sdSample.toFixed(4)}`,
      `Population SD (σ) = √(Sum of SqDiff / n) = ${sdPop.toFixed(4)}`
    ]

    return {
      error: null,
      mean,
      sdSample,
      sdPop,
      steps
    }
  }, [data])

  return (
    <FormCalculatorShell title="Standard Deviation Calculator" subtitle="Solve standard deviations for sample and population datasets" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Dataset (comma or space separated)" value={data} onChange={setData} placeholder="10, 12, 23, 23" id="sd-data" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Mean" value={results.mean.toFixed(4)} />
                <ResultDisplay label="Sample SD" value={results.sdSample.toFixed(4)} />
                <ResultDisplay label="Population SD" value={results.sdPop.toFixed(4)} />
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
