'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ScientificCalculator() {
  const [valStr, setValStr] = useState('45') // degrees

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, sin: 0, cos: 0, ln: 0, log10: 0 }
    const val = parseFloat(valStr)

    if (isNaN(val)) return { ...defaultObj, error: 'Please enter a valid number.' }

    const rad = (val * Math.PI) / 180
    return {
      error: null,
      sin: Math.sin(rad),
      cos: Math.cos(rad),
      ln: val > 0 ? Math.log(val) : 0,
      log10: val > 0 ? Math.log10(val) : 0
    }
  }, [valStr])

  return (
    <FormCalculatorShell title="Scientific Function Solver" subtitle="Calculate basic trigonometric and logarithmic functions" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Input Value (x)" value={valStr} onChange={setValStr} id="sc-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="sin(x°)" value={results.sin.toFixed(4)} />
              <ResultDisplay label="cos(x°)" value={results.cos.toFixed(4)} />
              <ResultDisplay label="ln(x)" value={parseFloat(valStr) > 0 ? results.ln.toFixed(4) : 'Undefined (x <= 0)'} />
              <ResultDisplay label="log10(x)" value={parseFloat(valStr) > 0 ? results.log10.toFixed(4) : 'Undefined (x <= 0)'} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
