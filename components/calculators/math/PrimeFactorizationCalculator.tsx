'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function primeFactors(n: number): number[] {
  const factors: number[] = []
  let d = 2
  while (d * d <= n) {
    while (n % d === 0) { factors.push(d); n /= d }
    d++
  }
  if (n > 1) factors.push(n)
  return factors
}

function isPrime(n: number): boolean {
  if (n < 2) return false
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false
  return true
}

export default function PrimeFactorizationCalculator() {
  const [val, setVal] = useState('')
  const [result, setResult] = useState('')

  const calculate = () => {
    const n = parseInt(val)
    if (isNaN(n) || n < 2) { setResult('Enter an integer ≥ 2'); return }
    if (n > 1e12) { setResult('Number too large (max 1 trillion)'); return }
    const factors = primeFactors(n)
    const factorStr = factors.join(' × ')
    const prime = isPrime(n)
    setResult(`${n} = ${factorStr}${prime ? ' (prime number)' : ''}`)
  }

  return (
    <FormCalculatorShell title="Prime Factorization" badge="MATH">
      <RetroInput label="Number" value={val} onChange={setVal} placeholder="e.g. 84" id="pf-num" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Factorize</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Prime Factors" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
