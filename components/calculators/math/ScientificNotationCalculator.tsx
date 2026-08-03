'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ScientificNotationCalculator() {
  const [valStr, setValStr] = useState('1234500')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      scientific: '',
      engineering: '',
      steps: [] as string[]
    }

    const val = parseFloat(valStr)
    if (isNaN(val)) {
      return { ...defaultObj, error: 'Please enter a valid number.' }
    }

    const scientific = val.toExponential(4)
    
    // Engineering: exponent must be multiple of 3
    const exponent = Math.floor(Math.log10(Math.abs(val)))
    const engExponent = Math.floor(exponent / 3) * 3
    const engBase = val / Math.pow(10, engExponent)
    const engineering = `${engBase.toFixed(3)}e${engExponent >= 0 ? '+' : ''}${engExponent}`

    const steps = [
      `Scientific notation: a × 10^b (1 <= a < 10)`,
      `Scientific output = ${scientific}`,
      `Engineering notation exponent = multiple of 3`,
      `Engineering output = ${engineering}`
    ]

    return {
      error: null,
      scientific,
      engineering,
      steps
    }
  }, [valStr])

  return (
    <FormCalculatorShell title="Scientific Notation Calculator" subtitle="Convert standard numbers to scientific and engineering notation" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Input Number" value={valStr} onChange={setValStr} id="sci-val" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Scientific" value={results.scientific} large />
                <ResultDisplay label="Engineering" value={results.engineering} large />
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
