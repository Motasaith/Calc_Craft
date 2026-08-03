'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ArithmeticSequenceCalculator() {
  const [a1Str, setA1Str] = useState('2') // first term
  const [dStr, setDStr] = useState('3') // common difference
  const [nStr, setNStr] = useState('10') // term number

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, nthTerm: 0, sum: 0 }
    const a1 = parseFloat(a1Str)
    const d = parseFloat(dStr)
    const n = parseInt(nStr)

    if (isNaN(a1) || isNaN(d) || isNaN(n) || n <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const nthTerm = a1 + (n - 1) * d
    const sum = (n / 2) * (a1 + nthTerm)

    return { error: null, nthTerm, sum }
  }, [a1Str, dStr, nStr])

  return (
    <FormCalculatorShell title="Arithmetic Progression Solver" subtitle="Calculate the n-th term and cumulative sum of an AP sequence" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="First Term (a₁)" value={a1Str} onChange={setA1Str} id="ap-a1" />
          <RetroInput label="Common Difference (d)" value={dStr} onChange={setDStr} id="ap-d" />
          <RetroInput label="Term Position (n)" value={nStr} onChange={setNStr} id="ap-n" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="n-th Term (aₙ)" value={results.nthTerm.toString()} large />
              <ResultDisplay label="Sum of n Terms (Sₙ)" value={results.sum.toString()} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
