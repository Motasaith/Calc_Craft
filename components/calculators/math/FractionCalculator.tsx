'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b)
  while (b) { const t = b; b = a % b; a = t }
  return a
}

export default function FractionCalculator() {
  const [n1, setN1] = useState(''); const [d1, setD1] = useState('')
  const [n2, setN2] = useState(''); const [d2, setD2] = useState('')
  const [op, setOp] = useState('+')
  const [result, setResult] = useState<{ num: number; den: number; decimal: string } | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError(''); setResult(null)
    const a = parseInt(n1), b = parseInt(d1), c = parseInt(n2), d = parseInt(d2)
    if ([a, b, c, d].some(isNaN)) { setError('Enter valid integers'); return }
    if (b === 0 || d === 0) { setError('Denominator cannot be zero'); return }
    if (op === '/' && c === 0) { setError('Cannot divide by zero fraction'); return }

    let rn = 0, rd = 0
    switch (op) {
      case '+': rn = a * d + c * b; rd = b * d; break
      case '-': rn = a * d - c * b; rd = b * d; break
      case '*': rn = a * c; rd = b * d; break
      case '/': rn = a * d; rd = b * c; break
    }

    // Simplify
    if (rd < 0) { rn = -rn; rd = -rd }
    const g = gcd(Math.abs(rn), rd)
    rn /= g; rd /= g

    setResult({ num: rn, den: rd, decimal: (rn / rd).toFixed(8).replace(/0+$/, '').replace(/\.$/, '') })
  }

  return (
    <FormCalculatorShell title="Fraction Calculator" badge="MATH">
      <div className="grid grid-cols-5 gap-2 items-end">
        <div className="col-span-2">
          <RetroInput label="Numerator 1" value={n1} onChange={setN1} placeholder="3" id="frac-n1" />
          <RetroInput label="Denominator 1" value={d1} onChange={setD1} placeholder="4" id="frac-d1" />
        </div>
        <div className="flex justify-center">
          <RetroSelect label="Op" value={op} onChange={setOp} id="frac-op"
            options={[{ value: '+', label: '+' }, { value: '-', label: '−' }, { value: '*', label: '×' }, { value: '/', label: '÷' }]} />
        </div>
        <div className="col-span-2">
          <RetroInput label="Numerator 2" value={n2} onChange={setN2} placeholder="1" id="frac-n2" />
          <RetroInput label="Denominator 2" value={d2} onChange={setD2} placeholder="2" id="frac-d2" />
        </div>
      </div>

      <div className="mt-4">
        <RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton>
      </div>

      {error && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">{error}</div>}

      {result && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ResultDisplay label="Fraction" value={`${result.num}/${result.den}`} large />
          <ResultDisplay label="Decimal" value={result.decimal} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
