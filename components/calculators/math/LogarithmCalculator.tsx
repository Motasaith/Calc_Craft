'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function LogarithmCalculator() {
  const [valStr, setValStr] = useState('100')
  const [baseStr, setBaseStr] = useState('10')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      result: 0,
      steps: [] as string[]
    }

    const val = parseFloat(valStr)
    const base = parseFloat(baseStr)

    if (isNaN(val) || isNaN(base) || val <= 0 || base <= 0 || base === 1) {
      return { ...defaultObj, error: 'Please enter a valid positive value and a base greater than 0 and not equal to 1.' }
    }

    const resVal = Math.log(val) / Math.log(base)
    const steps = [
      `Formula: log_base(x) = ln(x) / ln(base)`,
      `ln(${val}) = ${Math.log(val).toFixed(4)}`,
      `ln(${base}) = ${Math.log(base).toFixed(4)}`,
      `Result = ${resVal.toFixed(6)}`
    ]

    return {
      error: null,
      result: resVal,
      steps
    }
  }, [valStr, baseStr])

  return (
    <FormCalculatorShell title="Logarithm Calculator" subtitle="Solve log of a value to any base" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Value (x)" value={valStr} onChange={setValStr} id="log-x" />
          <RetroInput label="Base (b)" value={baseStr} onChange={setBaseStr} id="log-base" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-1">
                <ResultDisplay label="Logarithm Value" value={results.result.toFixed(6)} large />
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
