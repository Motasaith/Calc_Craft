'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function IntegralCalculator() {
  const [aStr, setAStr] = useState('0') // lower limit
  const [bStr, setBStr] = useState('2') // upper limit

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, value: 0 }
    const a = parseFloat(aStr)
    const b = parseFloat(bStr)
    if (isNaN(a) || isNaN(b)) return { ...defaultObj, error: 'Please enter valid limits.' }
    // f(x) = x^2 definite integral = [x^3 / 3]
    const value = (Math.pow(b, 3) - Math.pow(a, 3)) / 3
    return { error: null, value }
  }, [aStr, bStr])

  return (
    <FormCalculatorShell title="Definite Integral Solver (x²)" subtitle="Evaluate the definite integral of f(x) = x² in boundaries [a, b]" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Lower Limit (a)" value={aStr} onChange={setAStr} id="ic-a" />
          <RetroInput label="Upper Limit (b)" value={bStr} onChange={setBStr} id="ic-b" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Definite Integral Value" value={results.value.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
