'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

export default function ConfidenceIntervalCalculator() {
  const [meanStr, setMeanStr] = useState('100')
  const [sdStr, setSdStr] = useState('15')
  const [nStr, setNStr] = useState('50')
  const [level, setLevel] = useState('95') // percentage

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      marginOfError: 0,
      lower: 0,
      upper: 0,
      steps: [] as string[]
    }

    const mean = parseFloat(meanStr)
    const sd = parseFloat(sdStr)
    const n = parseInt(nStr)

    if (isNaN(mean) || isNaN(sd) || isNaN(n) || sd <= 0 || n <= 0) {
      return { ...defaultObj, error: 'Please enter valid values (SD and Sample Size must be positive).' }
    }

    // Z-critical value lookup
    let z = 1.96
    if (level === '90') z = 1.645
    else if (level === '99') z = 2.576

    const sem = sd / Math.sqrt(n)
    const marginOfError = z * sem
    const lower = mean - marginOfError
    const upper = mean + marginOfError

    const steps = [
      `Standard Error (SE) = σ / √n = ${sd} / √${n} = ${sem.toFixed(4)}`,
      `Critical Z-value (${level}%) = ${z}`,
      `Margin of Error = Z × SE = ${z} × ${sem.toFixed(4)} = ${marginOfError.toFixed(4)}`,
      `Interval = [${lower.toFixed(4)}, ${upper.toFixed(4)}]`
    ]

    return {
      error: null,
      marginOfError,
      lower,
      upper,
      steps
    }
  }, [meanStr, sdStr, nStr, level])

  return (
    <FormCalculatorShell title="Confidence Interval Calculator" subtitle="Solve confidence intervals for normal distributions" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Sample Mean (μ)" value={meanStr} onChange={setMeanStr} id="ci-mean" />
          <RetroInput label="Std Dev (σ)" value={sdStr} onChange={setSdStr} id="ci-sd" />
          <RetroInput label="Sample Size (n)" value={nStr} onChange={setNStr} id="ci-n" />
          <RetroSelect
            label="Confidence Level"
            value={level}
            onChange={setLevel}
            id="ci-level"
            options={[
              { value: '90', label: '90%' },
              { value: '95', label: '95%' },
              { value: '99', label: '99%' }
            ]}
          />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Margin of Error" value={results.marginOfError.toFixed(4)} />
                <ResultDisplay label="Lower Bound" value={results.lower.toFixed(4)} />
                <ResultDisplay label="Upper Bound" value={results.upper.toFixed(4)} />
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
