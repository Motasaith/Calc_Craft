'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function fact(num: number): number {
  let f = 1
  for (let i = 1; i <= num; i++) f *= i
  return f
}

export default function BinomialCalculator() {
  const [trialsStr, setTrialsStr] = useState('10') // n
  const [successesStr, setSuccessesStr] = useState('3') // k
  const [probStr, setProbStr] = useState('0.5') // p

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, probability: 0, steps: [] as string[] }
    const n = parseInt(trialsStr)
    const k = parseInt(successesStr)
    const p = parseFloat(probStr)

    if (isNaN(n) || isNaN(k) || isNaN(p) || n <= 0 || k < 0 || k > n || p < 0 || p > 1) {
      return { ...defaultObj, error: 'Please enter valid parameters where k <= n and 0 <= p <= 1.' }
    }

    if (n > 20) return { ...defaultObj, error: 'Calculations capped at n = 20 for factorial limits.' }

    const combinations = fact(n) / (fact(k) * fact(n - k))
    const probability = combinations * Math.pow(p, k) * Math.pow(1 - p, n - k)

    return {
      error: null,
      probability,
      steps: [
        `Formula: P(X = k) = C(n, k) × p^k × (1 - p)^(n-k)`,
        `C(${n}, ${k}) = ${combinations}`,
        `P(X = ${k}) = ${probability.toFixed(6)}`
      ]
    }
  }, [trialsStr, successesStr, probStr])

  return (
    <FormCalculatorShell title="Binomial Probability Solver" subtitle="Calculate probability distribution for successes in n trials" badge="STATISTICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Trials (n)" value={trialsStr} onChange={setTrialsStr} id="bin-n" />
          <RetroInput label="Successes (k)" value={successesStr} onChange={setSuccessesStr} id="bin-k" />
          <RetroInput label="Probability of Success (p)" value={probStr} onChange={setProbStr} id="bin-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Probability P(X = k)" value={results.probability.toFixed(6)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
