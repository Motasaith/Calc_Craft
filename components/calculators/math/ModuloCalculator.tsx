'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ModuloCalculator() {
  const [dividendStr, setDividendStr] = useState('23')
  const [divisorStr, setDivisorStr] = useState('5')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, remainder: 0, steps: [] as string[] }
    const a = parseInt(dividendStr)
    const b = parseInt(divisorStr)
    if (isNaN(a) || isNaN(b) || b === 0) return { ...defaultObj, error: 'Please enter valid integers with a non-zero divisor.' }
    const remainder = a % b
    const quotient = Math.floor(a / b)
    return {
      error: null,
      remainder,
      steps: [
        `Dividend (a) = ${a}`,
        `Divisor (b) = ${b}`,
        `Formula: a mod b = remainder of a / b`,
        `${a} = ${b} × ${quotient} + ${remainder}`,
        `Remainder = ${remainder}`
      ]
    }
  }, [dividendStr, divisorStr])

  return (
    <FormCalculatorShell title="Modulo Remainder Solver" subtitle="Calculate remainder values of modular division arithmetic" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Dividend (a)" value={dividendStr} onChange={setDividendStr} id="mod-a" />
          <RetroInput label="Divisor (b)" value={divisorStr} onChange={setDivisorStr} id="mod-b" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Remainder (a mod b)" value={results.remainder.toString()} large />
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
