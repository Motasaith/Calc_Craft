'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

const Z_VALUES: Record<string, number> = { '90': 1.645, '95': 1.96, '99': 2.576 }

export default function ConfidenceIntervalCalculator() {
  const [mean, setMean] = useState('')
  const [sd, setSd] = useState('')
  const [n, setN] = useState('')
  const [confidence, setConfidence] = useState('95')
  const [result, setResult] = useState<{lower:number,upper:number,margin:number}|null>(null)

  const calculate = () => {
    const m = parseFloat(mean), s = parseFloat(sd), nv = parseInt(n)
    if (isNaN(m)||isNaN(s)||isNaN(nv) || nv < 2 || s <= 0) { setResult(null); return }
    const z = Z_VALUES[confidence] || 1.96
    const margin = z * (s / Math.sqrt(nv))
    setResult({ lower: m - margin, upper: m + margin, margin })
  }

  return (
    <FormCalculatorShell title="Confidence Interval" badge="MATH">
      <RetroInput label="Sample Mean" value={mean} onChange={setMean} placeholder="50" id="ci-mean" />
      <RetroInput label="Sample Std Dev" value={sd} onChange={setSd} placeholder="10" id="ci-sd" />
      <RetroInput label="Sample Size (n)" value={n} onChange={setN} placeholder="100" id="ci-n" />
      <RetroSelect label="Confidence Level" value={confidence} onChange={setConfidence} options={[{value:'90',label:'90%'},{value:'95',label:'95%'},{value:'99',label:'99%'}]} id="ci-conf" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Lower Bound" value={result.lower.toFixed(4)} />
          <ResultDisplay label="Margin of Error" value={result.margin.toFixed(4)} />
          <ResultDisplay label="Upper Bound" value={result.upper.toFixed(4)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
