'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FactorialCalculator() {
  const [valStr, setValStr] = useState('5')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      result: 0,
      steps: [] as string[]
    }

    const n = parseInt(valStr)

    if (isNaN(n) || n < 0 || !Number.isInteger(n)) {
      return { ...defaultObj, error: 'Please enter a valid non-negative integer.' }
    }

    if (n > 170) {
      return { ...defaultObj, error: 'Factorials above 170 exceed JS capacity (Infinity).' }
    }

    let fact = 1
    const mults = []
    for (let i = 1; i <= n; i++) {
      fact *= i
      mults.push(i)
    }

    const steps = [
      `n! = 1 × 2 × ... × n`,
      `${n}! = ${mults.join(' × ') || '1'} = ${fact}`
    ]

    return {
      error: null,
      result: fact,
      steps
    }
  }, [valStr])

  return (
    <FormCalculatorShell title="Factorial Calculator" subtitle="Solve n! for a non-negative integer" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Input n" value={valStr} onChange={setValStr} id="fact-val" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-1">
                <ResultDisplay label="Result (n!)" value={results.result.toLocaleString()} large />
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
