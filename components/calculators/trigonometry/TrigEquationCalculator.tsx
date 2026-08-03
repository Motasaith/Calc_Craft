'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TrigEquationCalculator() {
  const [constStr, setConstStr] = useState('0.5') // sin(x) = C

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, sol1: 0, sol2: 0 }
    const c = parseFloat(constStr)

    if (isNaN(c) || c < -1 || c > 1) {
      return { ...defaultObj, error: 'sine constant C must be between -1 and 1.' }
    }

    const rad1 = Math.asin(c)
    const deg1 = (rad1 * 180) / Math.PI
    const deg2 = 180 - deg1

    return { error: null, sol1: deg1, sol2: deg2 }
  }, [constStr])

  return (
    <FormCalculatorShell title="Sine Equation Solver" subtitle="Resolve basic trigonometric equations of style sin(x) = C" badge="TRIGONOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Sine Constant (C)" value={constStr} onChange={setConstStr} id="te-c" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="First Solution (x1)" value={`${results.sol1.toFixed(2)}°`} />
              <ResultDisplay label="Second Solution (x2)" value={`${results.sol2.toFixed(2)}°`} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
