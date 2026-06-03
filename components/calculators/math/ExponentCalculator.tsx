'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function ExponentCalculator() {
  const [base, setBase] = useState('')
  const [exp, setExp] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError(''); setResult(null)
    const b = parseFloat(base), e = parseFloat(exp)
    if (isNaN(b) || isNaN(e)) { setError('Enter valid numbers'); return }
    if (b === 0 && e < 0) { setError('0 raised to negative power is undefined'); return }
    if (b < 0 && !Number.isInteger(e)) { setError('Negative base with non-integer exponent gives complex result'); return }
    const r = Math.pow(b, e)
    if (!isFinite(r)) { setError('Result is too large'); return }
    setResult(parseFloat(r.toPrecision(12)).toString())
  }

  return (
    <FormCalculatorShell title="Exponent Calculator" subtitle="Calculate base^exponent" badge="MATH">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Base" value={base} onChange={setBase} placeholder="e.g. 2" id="exp-base" />
        <RetroInput label="Exponent" value={exp} onChange={setExp} placeholder="e.g. 10" id="exp-exp" />
      </div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {error && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">{error}</div>}
      {result && <div className="mt-4"><ResultDisplay label={`${base}^${exp}`} value={result} large /></div>}
    </FormCalculatorShell>
  )
}
