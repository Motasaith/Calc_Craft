'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PoissonCalculator() {
  const [lambdaStr, setLambdaStr] = useState('3') // mean rate
  const [kStr, setKStr] = useState('2') // actual events

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, prob: 0 }
    const lam = parseFloat(lambdaStr)
    const k = parseInt(kStr)

    if (isNaN(lam) || isNaN(k) || lam <= 0 || k < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const factorial = (n: number): number => {
      let r = 1
      for (let i = 2; i <= n; i++) r *= i
      return r
    }

    const prob = (Math.pow(lam, k) * Math.exp(-lam)) / factorial(k)
    return { error: null, prob }
  }, [lambdaStr, kStr])

  return (
    <FormCalculatorShell title="Poisson Probability Solver" subtitle="Calculate probability mass index values P(X = k)" badge="STATISTICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Mean Arrival Rate (λ)" value={lambdaStr} onChange={setLambdaStr} id="ps-l" />
          <RetroInput label="Event Count (k)" value={kStr} onChange={setKStr} id="ps-k" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Poisson Probability P(X=k)" value={results.prob.toFixed(5)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
