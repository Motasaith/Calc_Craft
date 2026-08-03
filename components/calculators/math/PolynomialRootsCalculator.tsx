'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PolynomialRootsCalculator() {
  const [aStr, setAStr] = useState('1')
  const [bStr, setBStr] = useState('-5')
  const [cStr, setCStr] = useState('6')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, r1: '', r2: '' }
    const a = parseFloat(aStr)
    const b = parseFloat(bStr)
    const c = parseFloat(cStr)

    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
      return { ...defaultObj, error: 'Please enter valid coefficients with non-zero a.' }
    }

    const disc = b * b - 4 * a * c
    if (disc >= 0) {
      const r1 = (-b + Math.sqrt(disc)) / (2 * a)
      const r2 = (-b - Math.sqrt(disc)) / (2 * a)
      return { error: null, r1: r1.toString(), r2: r2.toString() }
    } else {
      const real = -b / (2 * a)
      const imag = Math.sqrt(-disc) / (2 * a)
      return {
        error: null,
        r1: `${real.toFixed(2)} + ${imag.toFixed(2)}i`,
        r2: `${real.toFixed(2)} - ${imag.toFixed(2)}i`
      }
    }
  }, [aStr, bStr, cStr])

  return (
    <FormCalculatorShell title="Polynomial Roots Solver" subtitle="Calculate real and complex roots of quadratic equations ax² + bx + c = 0" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="a coefficient" value={aStr} onChange={setAStr} id="pr-a" />
          <RetroInput label="b coefficient" value={bStr} onChange={setBStr} id="pr-b" />
          <RetroInput label="c coefficient" value={cStr} onChange={setCStr} id="pr-c" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Root 1" value={results.r1} large />
              <ResultDisplay label="Root 2" value={results.r2} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
