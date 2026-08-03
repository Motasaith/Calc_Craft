'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BasicCalculator() {
  const [num1Str, setNum1Str] = useState('10')
  const [num2Str, setNum2Str] = useState('5')

  const results = useMemo(() => {
    const n1 = parseFloat(num1Str)
    const n2 = parseFloat(num2Str)
    const defaultObj = { error: null as string | null, sum: 0, diff: 0, prod: 0, quot: 0 }

    if (isNaN(n1) || isNaN(n2)) {
      return { ...defaultObj, error: 'Please enter valid numbers.' }
    }

    return {
      error: null,
      sum: n1 + n2,
      diff: n1 - n2,
      prod: n1 * n2,
      quot: n2 !== 0 ? n1 / n2 : 0
    }
  }, [num1Str, num2Str])

  return (
    <FormCalculatorShell title="Standard Arithmetic Solver" subtitle="Perform simple addition, subtraction, multiplication, and division" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="First Number" value={num1Str} onChange={setNum1Str} id="bc-n1" />
          <RetroInput label="Second Number" value={num2Str} onChange={setNum2Str} id="bc-n2" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Sum (A + B)" value={results.sum.toString()} />
              <ResultDisplay label="Difference (A - B)" value={results.diff.toString()} />
              <ResultDisplay label="Product (A * B)" value={results.prod.toString()} />
              <ResultDisplay label="Quotient (A / B)" value={parseFloat(num2Str) !== 0 ? results.quot.toFixed(4) : 'Undefined (Divide by Zero)'} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
