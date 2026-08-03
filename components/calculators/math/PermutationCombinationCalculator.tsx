'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function fact(num: number): number {
  let f = 1
  for (let i = 1; i <= num; i++) f *= i
  return f
}

export default function PermutationCombinationCalculator() {
  const [nStr, setNStr] = useState('5')
  const [rStr, setRStr] = useState('3')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      permutations: 0,
      combinations: 0,
      steps: [] as string[]
    }

    const n = parseInt(nStr)
    const r = parseInt(rStr)

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
      return { ...defaultObj, error: 'Please enter valid non-negative integers where r <= n.' }
    }

    if (n > 20) {
      return { ...defaultObj, error: 'Calculations for n > 20 exceed safe capacity.' }
    }

    const p = fact(n) / fact(n - r)
    const c = p / fact(r)

    const steps = [
      `Permutations P(n, r) = n! / (n - r)! = ${n}! / ${n - r}! = ${p}`,
      `Combinations C(n, r) = n! / (r! × (n - r)!) = ${c}`
    ]

    return {
      error: null,
      permutations: p,
      combinations: c,
      steps
    }
  }, [nStr, rStr])

  return (
    <FormCalculatorShell title="Permutations & Combinations" subtitle="Solve combinations and permutations options given n items and r selections" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Items (n)" value={nStr} onChange={setNStr} id="p-n" />
          <RetroInput label="Selections (r)" value={rStr} onChange={setRStr} id="p-r" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Permutations P(n,r)" value={results.permutations.toLocaleString()} large />
                <ResultDisplay label="Combinations C(n,r)" value={results.combinations.toLocaleString()} large />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Mathematical Steps</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results.error}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
