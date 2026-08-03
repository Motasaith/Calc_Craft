'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RoundingCalculator() {
  const [valStr, setValStr] = useState('3.754')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      round: 0,
      ceil: 0,
      floor: 0,
      steps: [] as string[]
    }

    const val = parseFloat(valStr)
    if (isNaN(val)) {
      return { ...defaultObj, error: 'Please enter a valid number.' }
    }

    const round = Math.round(val)
    const ceil = Math.ceil(val)
    const floor = Math.floor(val)

    const steps = [
      `Round (nearest integer): ${round}`,
      `Ceiling (up to nearest integer): ${ceil}`,
      `Floor (down to nearest integer): ${floor}`
    ]

    return {
      error: null,
      round,
      ceil,
      floor,
      steps
    }
  }, [valStr])

  return (
    <FormCalculatorShell title="Rounding Calculator" subtitle="Round numbers to nearest ceiling or floor integers" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Input Value" value={valStr} onChange={setValStr} id="round-val" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Standard Round" value={results.round.toString()} />
                <ResultDisplay label="Ceiling (Ceil)" value={results.ceil.toString()} />
                <ResultDisplay label="Floor" value={results.floor.toString()} />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Mathematical Rounding Outputs</p>
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
