'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function ChiSquareCalculator() {
  const [observed, setObserved] = useState('10,15,20')
  const [expected, setExpected] = useState('12,15,18')
  const [result, setResult] = useState<{chi2:number,df:number}|null>(null)

  const calculate = () => {
    const o = observed.split(',').map(Number).filter(n => !isNaN(n))
    const e = expected.split(',').map(Number).filter(n => !isNaN(n))
    if (o.length !== e.length || o.length === 0) { setResult(null); return }
    let chi2 = 0
    for (let i = 0; i < o.length; i++) {
      if (e[i] === 0) { setResult(null); return }
      chi2 += Math.pow(o[i] - e[i], 2) / e[i]
    }
    setResult({ chi2, df: o.length - 1 })
  }

  return (
    <FormCalculatorShell title="Chi-Square Test" badge="STATISTICS">
      <RetroInput label="Observed (comma sep)" value={observed} onChange={setObserved} placeholder="10,15,20" id="chi-o" />
      <RetroInput label="Expected (comma sep)" value={expected} onChange={setExpected} placeholder="12,15,18" id="chi-e" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="χ²" value={result.chi2.toFixed(4)} large />
          <ResultDisplay label="df" value={result.df} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
