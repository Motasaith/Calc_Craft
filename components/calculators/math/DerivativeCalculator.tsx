'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DerivativeCalculator() {
  const [aStr, setAStr] = useState('3') // coefficient
  const [pStr, setPStr] = useState('2') // exponent

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, derivative: '', steps: [] as string[] }
    const a = parseFloat(aStr)
    const p = parseFloat(pStr)
    if (isNaN(a) || isNaN(p)) return { ...defaultObj, error: 'Please enter valid coefficients.' }
    const coeff = a * p
    const exp = p - 1
    const derivative = `${coeff}x^${exp}`
    return {
      error: null,
      derivative,
      steps: [
        `Function: f(x) = ${a}x^${p}`,
        `Power Rule: d/dx[xⁿ] = n·x^(n-1)`,
        `f'(x) = ${a} × ${p}x^(${p} - 1) = ${derivative}`
      ]
    }
  }, [aStr, pStr])

  return (
    <FormCalculatorShell title="Power Rule Derivative Solver" subtitle="Calculate symbolic derivatives using power rules" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Coefficient (a)" value={aStr} onChange={setAStr} id="dc-a" />
          <RetroInput label="Exponent (n)" value={pStr} onChange={setPStr} id="dc-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Derivative f'(x)" value={results.derivative} large />
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
