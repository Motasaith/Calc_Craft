'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GeometricSequenceCalculator() {
  const [a1Str, setA1Str] = useState('2') // first term
  const [rStr, setRStr] = useState('3') // common ratio
  const [nStr, setNStr] = useState('5') // term number

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, nthTerm: 0, sum: 0 }
    const a1 = parseFloat(a1Str)
    const r = parseFloat(rStr)
    const n = parseInt(nStr)

    if (isNaN(a1) || isNaN(r) || isNaN(n) || n <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const nthTerm = a1 * Math.pow(r, n - 1)
    const sum = r === 1 ? a1 * n : a1 * (1 - Math.pow(r, n)) / (1 - r)

    return { error: null, nthTerm, sum }
  }, [a1Str, rStr, nStr])

  return (
    <FormCalculatorShell title="Geometric Progression Solver" subtitle="Calculate the n-th term and cumulative sum of a GP sequence" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="First Term (a₁)" value={a1Str} onChange={setA1Str} id="gp-a1" />
          <RetroInput label="Common Ratio (r)" value={rStr} onChange={setRStr} id="gp-r" />
          <RetroInput label="Term Position (n)" value={nStr} onChange={setNStr} id="gp-n" />
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
