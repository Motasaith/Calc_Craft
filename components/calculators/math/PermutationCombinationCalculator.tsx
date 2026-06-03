'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function factorial(n: number): number { if (n <= 1) return 1; let r = 1; for (let i = 2; i <= n; i++) r *= i; return r }

export default function PermutationCombinationCalculator() {
  const [n, setN] = useState(''); const [r, setR] = useState('')
  const [mode, setMode] = useState('nPr')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError(''); setResult(null)
    const nv = parseInt(n), rv = parseInt(r)
    if (isNaN(nv) || isNaN(rv)) { setError('Enter valid integers'); return }
    if (nv < 0 || rv < 0) { setError('Values must be non-negative'); return }
    if (rv > nv) { setError('r cannot be greater than n'); return }
    if (nv > 170) { setError('n is too large (max 170)'); return }

    let res: number
    if (mode === 'nPr') {
      res = factorial(nv) / factorial(nv - rv)
    } else if (mode === 'nCr') {
      res = factorial(nv) / (factorial(rv) * factorial(nv - rv))
    } else {
      res = factorial(nv)
    }

    if (!isFinite(res)) { setError('Result is too large'); return }
    setResult(res.toString())
  }

  return (
    <FormCalculatorShell title="Permutation & Combination" badge="MATH">
      <RetroSelect label="Type" value={mode} onChange={setMode} id="perm-mode"
        options={[{ value: 'nPr', label: 'Permutation (nPr)' }, { value: 'nCr', label: 'Combination (nCr)' }, { value: 'fact', label: 'Factorial (n!)' }]} />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="n" value={n} onChange={setN} placeholder="e.g. 10" id="perm-n" />
        {mode !== 'fact' && <RetroInput label="r" value={r} onChange={setR} placeholder="e.g. 3" id="perm-r" />}
      </div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {error && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">{error}</div>}
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
