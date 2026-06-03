'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function gcd(a: number, b: number): number { a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t }; return a }
function lcm(a: number, b: number): number { return Math.abs(a * b) / gcd(a, b) }

export default function GcdLcmCalculator() {
  const [data, setData] = useState('')
  const [result, setResult] = useState<{ gcd: number; lcm: number } | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError(''); setResult(null)
    const nums = data.split(/[,\s]+/).map(Number).filter((n) => !isNaN(n) && Number.isInteger(n) && n > 0)
    if (nums.length < 2) { setError('Enter at least 2 positive integers'); return }

    let g = nums[0], l = nums[0]
    for (let i = 1; i < nums.length; i++) { g = gcd(g, nums[i]); l = lcm(l, nums[i]) }
    if (!isFinite(l)) { setError('LCM is too large to compute'); return }

    setResult({ gcd: g, lcm: l })
  }

  return (
    <FormCalculatorShell title="GCD & LCM Calculator" badge="MATH">
      <RetroInput label="Numbers (comma separated)" value={data} onChange={setData} type="text" placeholder="e.g. 12, 18, 24" id="gcd-nums" />
      <RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton>
      {error && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">{error}</div>}
      {result && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ResultDisplay label="GCD" value={result.gcd.toString()} large />
          <ResultDisplay label="LCM" value={result.lcm.toString()} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
