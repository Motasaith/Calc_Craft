'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function nCr(n: number, r: number): number {
  if (r > n) return 0
  let res = 1
  for (let i = 1; i <= r; i++) { res = res * (n - i + 1) / i }
  return res
}

export default function BinomialCalculator() {
  const [n, setN] = useState('10')
  const [p, setP] = useState('0.5')
  const [k, setK] = useState('5')
  const [result, setResult] = useState<{prob:number,mean:number,variance:number}|null>(null)

  const calculate = () => {
    const nv = parseInt(n), pv = parseFloat(p), kv = parseInt(k)
    if (isNaN(nv)||isNaN(pv)||isNaN(kv) || nv<0 || kv<0 || kv>nv || pv<0 || pv>1) { setResult(null); return }
    const prob = nCr(nv, kv) * Math.pow(pv, kv) * Math.pow(1-pv, nv-kv)
    setResult({ prob, mean: nv*pv, variance: nv*pv*(1-pv) })
  }

  return (
    <FormCalculatorShell title="Binomial Distribution" badge="STATISTICS">
      <div className="grid grid-cols-3 gap-3"><RetroInput label="n (trials)" value={n} onChange={setN} placeholder="10" id="bin-n" /><RetroInput label="p (prob)" value={p} onChange={setP} placeholder="0.5" id="bin-p" /><RetroInput label="k (successes)" value={k} onChange={setK} placeholder="5" id="bin-k" /></div>
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
