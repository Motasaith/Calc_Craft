'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RatioCalculator() {
  const [aStr, setAStr] = useState('4')
  const [bStr, setBStr] = useState('3')
  const [cStr, setCStr] = useState('8')
  const [dStr, setDStr] = useState('')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      valD: 0,
      steps: [] as string[]
    }

    const a = parseFloat(aStr)
    const b = parseFloat(bStr)
    const c = parseFloat(cStr)

    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
      return { ...defaultObj, error: 'Please enter valid non-zero values for A, B, and C.' }
    }

    // Solve for D: A/B = C/D => D = (B * C) / A
    const valD = (b * c) / a

    const steps = [
      `Ratio proportion: A / B = C / D`,
      `${a} / ${b} = ${c} / D`,
      `D = (B × C) / A = (${b} × ${c}) / ${a} = ${valD.toFixed(4)}`
    ]

    return {
      error: null,
      valD,
      steps
    }
  }, [aStr, bStr, cStr])

  return (
    <FormCalculatorShell title="Ratio Calculator" subtitle="Solve proportions (A : B = C : D)" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Value A" value={aStr} onChange={setAStr} id="rat-a" />
            <RetroInput label="Value B" value={bStr} onChange={setBStr} id="rat-b" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Value C" value={cStr} onChange={setCStr} id="rat-c" />
            <ResultDisplay label="Value D (Solved)" value={results.error ? '—' : results.valD.toFixed(4)} />
          </div>
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
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
