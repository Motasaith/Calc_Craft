'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PercentageCalculator() {
  const [val1Str, setVal1Str] = useState('20')
  const [val2Str, setVal2Str] = useState('150')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      pctOf: 0,
      whatPct: 0,
      steps: [] as string[]
    }

    const v1 = parseFloat(val1Str)
    const v2 = parseFloat(val2Str)

    if (isNaN(v1) || isNaN(v2)) {
      return { ...defaultObj, error: 'Please enter valid numbers.' }
    }

    const pctOf = (v1 / 100) * v2
    const whatPct = v2 !== 0 ? (v1 / v2) * 100 : 0

    const steps = [
      `${v1}% of ${v2} = (${v1}/100) × ${v2} = ${pctOf.toFixed(4)}`,
      `${v1} is what percent of ${v2}? = (${v1}/${v2}) × 100 = ${whatPct.toFixed(2)}%`
    ]

    return {
      error: null,
      pctOf,
      whatPct,
      steps
    }
  }, [val1Str, val2Str])

  return (
    <FormCalculatorShell title="Percentage Calculator" subtitle="Solve common percentage problems (X% of Y, or X is what % of Y)" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Value X" value={val1Str} onChange={setVal1Str} id="pct-v1" />
          <RetroInput label="Value Y" value={val2Str} onChange={setVal2Str} id="pct-v2" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="X% of Y" value={results.pctOf.toFixed(4)} large />
                <ResultDisplay label="X is what % of Y" value={`${results.whatPct.toFixed(2)}%`} large />
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
