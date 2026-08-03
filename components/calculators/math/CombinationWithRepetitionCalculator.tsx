'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function fact(num: number): number {
  let f = 1
  for (let i = 1; i <= num; i++) f *= i
  return f
}

export default function CombinationWithRepetitionCalculator() {
  const [nStr, setNStr] = useState('5')
  const [rStr, setRStr] = useState('3')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, value: 0 }
    const n = parseInt(nStr)
    const r = parseInt(rStr)

    if (isNaN(n) || isNaN(r) || n <= 0 || r < 0 || n + r - 1 > 20) {
      return { ...defaultObj, error: 'Please enter valid parameters where n+r-1 <= 20.' }
    }

    // C'(n, r) = C(n+r-1, r) = (n+r-1)! / (r! (n-1)!)
    const value = fact(n + r - 1) / (fact(r) * fact(n - 1))
    return { error: null, value }
  }, [nStr, rStr])

  return (
    <FormCalculatorShell title="Combinations with Repetitions Solver" subtitle="Calculate combination counts with replacement C'(n, r)" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Set Size (n)" value={nStr} onChange={setNStr} id="cwr-n" />
          <RetroInput label="Selection Count (r)" value={rStr} onChange={setRStr} id="cwr-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Combinations Count" value={results.value.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
