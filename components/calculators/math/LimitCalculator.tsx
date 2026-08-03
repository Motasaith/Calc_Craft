'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function LimitCalculator() {
  const [targetStr, setTargetStr] = useState('2') // x approaches value

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, value: 0 }
    const c = parseFloat(targetStr)
    if (isNaN(c)) return { ...defaultObj, error: 'Please enter a valid target limit value.' }
    // Function: f(x) = (x^2 - c^2)/(x - c) approaches 2*c
    const value = 2 * c
    return { error: null, value }
  }, [targetStr])

  return (
    <FormCalculatorShell title="Numerical Limit Solver" subtitle="Calculate limit of f(x) = (x² - c²)/(x - c) as x approaches c" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Limit Target Value (c)" value={targetStr} onChange={setTargetStr} id="lc-c" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Limit Value" value={results.value.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
