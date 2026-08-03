'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PrimeFactorizationCalculator() {
  const [numStr, setNumStr] = useState('24')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, factors: '', steps: [] as string[] }
    const n = parseInt(numStr)
    if (isNaN(n) || n <= 1 || n > 100000) {
      return { ...defaultObj, error: 'Please enter a valid integer between 2 and 100,000.' }
    }

    let temp = n
    let factorsList: number[] = []
    for (let i = 2; i <= temp; i++) {
      while (temp % i === 0) {
        factorsList.push(i)
        temp /= i
      }
    }

    return {
      error: null,
      factors: factorsList.join(' × '),
      steps: [
        `Number to factor: ${n}`,
        `Prime factor decomposition: ${factorsList.join(' × ')}`
      ]
    }
  }, [numStr])

  return (
    <FormCalculatorShell title="Prime Factorization Solver" subtitle="Find the prime factors decomposition of an integer" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Integer (2 to 100,000)" value={numStr} onChange={setNumStr} id="pf-num" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Prime Factors" value={results.factors} large />
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
