'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AbsoluteValueCalculator() {
  const [valStr, setValStr] = useState('-42')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, absVal: 0, steps: [] as string[] }
    const v = parseFloat(valStr)
    if (isNaN(v)) return { ...defaultObj, error: 'Please enter a valid number.' }
    const absVal = Math.abs(v)
    return {
      error: null,
      absVal,
      steps: [
        `Input Value (x) = ${v}`,
        `Formula: |x| = x if x >= 0 else -x`,
        `|${v}| = ${absVal}`
      ]
    }
  }, [valStr])

  return (
    <FormCalculatorShell title="Absolute Value Solver" subtitle="Find absolute magnitudes and offsets of numerical values" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Input Number (x)" value={valStr} onChange={setValStr} id="abs-x" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Absolute Value |x|" value={results.absVal.toString()} large />
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
