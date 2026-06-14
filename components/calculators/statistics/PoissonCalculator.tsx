'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function PoissonCalculator() {
  const [lambda, setLambda] = useState('4')
  const [k, setK] = useState('2')
  const [result, setResult] = useState<{prob:number,mean:number,variance:number}|null>(null)

  const calculate = () => {
    const l = parseFloat(lambda), kv = parseInt(k)
    if (isNaN(l)||isNaN(kv) || l<=0 || kv<0) { setResult(null); return }
    const prob = (Math.pow(l, kv) * Math.exp(-l)) / factorial(kv)
    setResult({ prob, mean: l, variance: l })
  }

  function factorial(n: number): number {
    let res = 1
    for (let i = 2; i <= n; i++) res *= i
    return res
  }

  return (
    <FormCalculatorShell title="Poisson Distribution" badge="STATISTICS">
      <RetroInput label="λ (lambda)" value={lambda} onChange={setLambda} placeholder="4" id="pois-l" />
      <RetroInput label="k (events)" value={k} onChange={setK} placeholder="2" id="pois-k" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="P(X=k)" value={result.prob.toFixed(6)} large />
          <ResultDisplay label="Mean" value={result.mean.toFixed(2)} />
          <ResultDisplay label="Variance" value={result.variance.toFixed(2)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
