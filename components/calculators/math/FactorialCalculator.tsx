'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FactorialCalculator() {
  const [numStr, setNumStr] = useState('6')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, factorial: 0, steps: [] as string[] }
    const n = parseInt(numStr)
    if (isNaN(n) || n < 0 || n > 20) return { ...defaultObj, error: 'Please enter a valid integer between 0 and 20.' }
    
    let factorial = 1
    let stepsList: number[] = []
    for (let i = 1; i <= n; i++) {
      factorial *= i
      stepsList.push(i)
    }

    return {
      error: null,
      factorial,
      steps: [
        `Formula: n! = n × (n - 1) × dots × 1`,
        `${n}! = ${stepsList.join(' × ') || '1'} = ${factorial}`
      ]
    }
  }, [numStr])

  return (
    <FormCalculatorShell title="Factorial Solver" subtitle="Calculate factorial products of integers" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Integer (0 to 20)" value={numStr} onChange={setNumStr} id="fact-n" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Factorial n!" value={results.factorial.toString()} large />
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
