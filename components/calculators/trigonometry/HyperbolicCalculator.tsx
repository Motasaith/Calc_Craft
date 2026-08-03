'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HyperbolicCalculator() {
  const [valStr, setValStr] = useState('1')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, sinh: 0, cosh: 0, tanh: 0 }
    const x = parseFloat(valStr)
    if (isNaN(x)) return { ...defaultObj, error: 'Please enter a valid number.' }
    const sinh = Math.sinh(x)
    const cosh = Math.cosh(x)
    const tanh = Math.tanh(x)
    return { error: null, sinh, cosh, tanh }
  }, [valStr])

  return (
    <FormCalculatorShell title="Hyperbolic Function Solver" subtitle="Calculate sinh, cosh, and tanh indices for real values" badge="TRIGONOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Input Value (x)" value={valStr} onChange={setValStr} id="hb-x" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-3 gap-2">
              <ResultDisplay label="sinh(x)" value={results.sinh.toFixed(4)} />
              <ResultDisplay label="cosh(x)" value={results.cosh.toFixed(4)} />
              <ResultDisplay label="tanh(x)" value={results.tanh.toFixed(4)} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
