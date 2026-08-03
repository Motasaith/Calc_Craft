'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function QuadraticCalculator() {
  const [aStr, setAStr] = useState('1')
  const [bStr, setBStr] = useState('-5')
  const [cStr, setCStr] = useState('6')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      root1: '',
      root2: '',
      discriminant: 0,
      steps: [] as string[]
    }

    const a = parseFloat(aStr)
    const b = parseFloat(bStr)
    const c = parseFloat(cStr)

    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
      return { ...defaultObj, error: 'Please enter valid coefficients (a cannot be 0).' }
    }

    const discriminant = b * b - 4 * a * c
    let root1 = ''
    let root2 = ''
    const steps = [
      `Discriminant (D) = b² - 4ac = (${b})² - 4(${a})(${c}) = ${discriminant}`
    ]

    if (discriminant >= 0) {
      const r1 = (-b + Math.sqrt(discriminant)) / (2 * a)
      const r2 = (-b - Math.sqrt(discriminant)) / (2 * a)
      root1 = r1.toFixed(4)
      root2 = r2.toFixed(4)
      steps.push(
        `Real Roots exist. Formula: x = (-b ± √D) / 2a`,
        `x₁ = (-(${b}) + √${discriminant}) / (2 × ${a}) = ${root1}`,
        `x₂ = (-(${b}) - √${discriminant}) / (2 × ${a}) = ${root2}`
      )
    } else {
      const real = (-b / (2 * a)).toFixed(4)
      const imag = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4)
      root1 = `${real} + ${imag}i`
      root2 = `${real} - ${imag}i`
      steps.push(
        `Complex Roots exist.`,
        `x₁ = ${root1}`,
        `x₂ = ${root2}`
      )
    }

    return {
      error: null,
      root1,
      root2,
      discriminant,
      steps
    }
  }, [aStr, bStr, cStr])

  return (
    <FormCalculatorShell title="Quadratic Equation Solver" subtitle="Find real and complex roots for ax² + bx + c = 0" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Coeff. a" value={aStr} onChange={setAStr} id="quad-a" />
          <RetroInput label="Coeff. b" value={bStr} onChange={setBStr} id="quad-b" />
          <RetroInput label="Coeff. c" value={cStr} onChange={setCStr} id="quad-c" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Root x₁" value={results.root1} large />
                <ResultDisplay label="Root x₂" value={results.root2} large />
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
