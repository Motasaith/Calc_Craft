'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ModuloCalculator() {
  const [aStr, setAStr] = useState('17')
  const [bStr, setBStr] = useState('5')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      mod: 0,
      quotient: 0,
      steps: [] as string[]
    }

    const a = parseInt(aStr)
    const b = parseInt(bStr)

    if (isNaN(a) || isNaN(b) || b === 0) {
      return { ...defaultObj, error: 'Please enter valid integers (divisor cannot be 0).' }
    }

    const mod = a % b
    const quotient = Math.floor(a / b)

    const steps = [
      `Modulo formula: a mod b = a - b × floor(a / b)`,
      `floor(${a} / ${b}) = ${quotient}`,
      `${a} - ${b} × ${quotient} = ${mod}`
    ]

    return {
      error: null,
      mod,
      quotient,
      steps
    }
  }, [aStr, bStr])

  return (
    <FormCalculatorShell title="Modulo Calculator" subtitle="Find the remainder after division" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Dividend (a)" value={aStr} onChange={setAStr} id="mod-a" />
          <RetroInput label="Divisor (b)" value={bStr} onChange={setBStr} id="mod-b" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Remainder (a mod b)" value={results.mod.toString()} large />
                <ResultDisplay label="Integer Quotient" value={results.quotient.toString()} large />
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
