'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function NthRootCalculator() {
  const [valStr, setValStr] = useState('16')
  const [nStr, setNStr] = useState('4')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      result: 0,
      steps: [] as string[]
    }

    const val = parseFloat(valStr)
    const n = parseFloat(nStr)

    if (isNaN(val) || isNaN(n) || n === 0) {
      return { ...defaultObj, error: 'Please enter valid numbers (n cannot be 0).' }
    }

    if (val < 0 && n % 2 === 0) {
      return { ...defaultObj, error: 'Even root of a negative number is complex.' }
    }

    const root = Math.pow(val, 1 / n)
    const steps = [
      `Formula: ⁿ√x = x^(1/n)`,
      `${n}√${val} = ${val}^(1/${n}) = ${root.toFixed(6)}`
    ]

    return {
      error: null,
      result: root,
      steps
    }
  }, [valStr, nStr])

  return (
    <FormCalculatorShell title="Nth Root Calculator" subtitle="Solve the nth root of a value" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Value (x)" value={valStr} onChange={setValStr} id="root-x" />
          <RetroInput label="Root Degree (n)" value={nStr} onChange={setNStr} id="root-n" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-1">
                <ResultDisplay label="Result (ⁿ√x)" value={results.result.toFixed(6)} large />
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
