'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ExponentCalculator() {
  const [baseStr, setBaseStr] = useState('2')
  const [expStr, setExpStr] = useState('10')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      result: 0,
      steps: [] as string[]
    }

    const base = parseFloat(baseStr)
    const exp = parseFloat(expStr)

    if (isNaN(base) || isNaN(exp)) {
      return { ...defaultObj, error: 'Please enter valid base and exponent.' }
    }

    if (base === 0 && exp < 0) {
      return { ...defaultObj, error: '0 raised to a negative power is undefined.' }
    }

    if (base < 0 && !Number.isInteger(exp)) {
      return { ...defaultObj, error: 'Negative base with fractional exponent is a complex number.' }
    }

    const resVal = Math.pow(base, exp)
    const steps = [
      `Expression: ${base}^${exp}`,
      `Calculation: ${base} raised to power ${exp} = ${resVal}`
    ]

    return {
      error: null,
      result: resVal,
      steps
    }
  }, [baseStr, expStr])

  return (
    <FormCalculatorShell title="Exponent Calculator" subtitle="Calculate base raised to the power of exponent" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Base (x)" value={baseStr} onChange={setBaseStr} id="exp-base" />
          <RetroInput label="Exponent (y)" value={expStr} onChange={setExpStr} id="exp-exp" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-1">
                <ResultDisplay label="Result (x^y)" value={results.result.toLocaleString()} large />
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
