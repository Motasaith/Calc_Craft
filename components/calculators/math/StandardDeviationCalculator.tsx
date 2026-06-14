'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function StandardDeviationCalculator() {
  const [data, setData] = useState('')
  const [type, setType] = useState<'sample' | 'population'>('sample')
  const [result, setResult] = useState<{mean:number,sd:number,variance:number,n:number}|null>(null)

  const calculate = () => {
    const nums = data.split(/[,\s]+/).map(Number).filter(n => !isNaN(n))
    if (nums.length < 2) { setResult(null); return }
    const n = nums.length
    const mean = nums.reduce((a,b) => a+b,0) / n
    const sqDiffs = nums.map(x => Math.pow(x - mean, 2))
    const variance = sqDiffs.reduce((a,b) => a+b,0) / (type === 'sample' ? n - 1 : n)
    setResult({ mean, sd: Math.sqrt(variance), variance, n })
  }

  return (
    <FormCalculatorShell title="Standard Deviation" badge="MATH">
      <RetroInput label="Data (comma or space separated)" value={data} onChange={setData} placeholder="2, 4, 4, 4, 5, 5, 7, 9" id="sd-data" />
      <RetroSelect label="Type" value={type} onChange={(v) => setType(v as any)} options={[{value:'sample',label:'Sample (n-1)'},{value:'population',label:'Population (n)'}]} id="sd-type" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Mean" value={result.mean.toFixed(4)} />
          <ResultDisplay label="Count (n)" value={result.n} />
          <ResultDisplay label="Variance" value={result.variance.toFixed(4)} />
          <ResultDisplay label="Std Dev" value={result.sd.toFixed(4)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
