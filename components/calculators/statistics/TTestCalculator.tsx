'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function TTestCalculator() {
  const [mode, setMode] = useState<'one' | 'two'>('one')
  const [data1, setData1] = useState('12,14,16,18,20')
  const [data2, setData2] = useState('10,12,14,16,18')
  const [mu, setMu] = useState('15')
  const [result, setResult] = useState<{t:number,mean:number,std:number}|null>(null)

  const calculate = () => {
    const d1 = data1.split(',').map(Number).filter(n => !isNaN(n))
    if (d1.length < 2) { setResult(null); return }
    const mean = d1.reduce((a,b) => a+b,0)/d1.length
    const variance = d1.reduce((s,x) => s + Math.pow(x-mean,2),0)/(d1.length-1)
    const std = Math.sqrt(variance)
    if (mode === 'one') {
      const muv = parseFloat(mu)
      if (isNaN(muv)) { setResult(null); return }
      const t = (mean - muv) / (std / Math.sqrt(d1.length))
      setResult({ t, mean, std })
    } else {
      const d2 = data2.split(',').map(Number).filter(n => !isNaN(n))
      if (d2.length < 2) { setResult(null); return }
      const mean2 = d2.reduce((a,b) => a+b,0)/d2.length
      const var2 = d2.reduce((s,x) => s + Math.pow(x-mean2,2),0)/(d2.length-1)
      const pooled = Math.sqrt((variance + var2) / 2)
      const t = (mean - mean2) / (pooled * Math.sqrt(2/d1.length))
      setResult({ t, mean, std })
    }
  }

  return (
    <FormCalculatorShell title="T-Test Calculator" badge="STATISTICS">
      <RetroSelect label="Type" value={mode} onChange={(v) => { setMode(v as any); setResult(null) }} options={[{value:'one',label:'One-Sample'},{value:'two',label:'Two-Sample'}]} id="tt-mode" />
      <RetroInput label="Sample Data" value={data1} onChange={setData1} placeholder="12,14,16,18,20" id="tt-d1" />
      {mode === 'one' && <RetroInput label="Hypothesized Mean (μ)" value={mu} onChange={setMu} placeholder="15" id="tt-mu" />}
      {mode === 'two' && <RetroInput label="Sample 2 Data" value={data2} onChange={setData2} placeholder="10,12,14,16,18" id="tt-d2" />}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="t-statistic" value={result.t.toFixed(4)} large />
          <ResultDisplay label="Mean" value={result.mean.toFixed(2)} />
          <ResultDisplay label="Std Dev" value={result.std.toFixed(2)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
