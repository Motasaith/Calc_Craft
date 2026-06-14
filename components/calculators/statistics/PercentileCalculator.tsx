'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function PercentileCalculator() {
  const [data, setData] = useState('10,20,30,40,50,60,70,80,90,100')
  const [value, setValue] = useState('55')
  const [result, setResult] = useState<{percentile:number,q1:number,median:number,q3:number}|null>(null)

  const calculate = () => {
    const arr = data.split(',').map(Number).filter(n => !isNaN(n)).sort((a,b) => a-b)
    const v = parseFloat(value)
    if (arr.length === 0 || isNaN(v)) { setResult(null); return }
    const below = arr.filter(x => x <= v).length
    const percentile = (below / arr.length) * 100
    const q1 = arr[Math.floor(arr.length * 0.25)]
    const median = arr.length % 2 === 1 ? arr[Math.floor(arr.length/2)] : (arr[arr.length/2-1] + arr[arr.length/2])/2
    const q3 = arr[Math.floor(arr.length * 0.75)]
    setResult({ percentile, q1, median, q3 })
  }

  return (
    <FormCalculatorShell title="Percentile Calculator" badge="STATISTICS">
      <RetroInput label="Data (comma sep)" value={data} onChange={setData} placeholder="10,20,30,40,50,60,70,80,90,100" id="per-d" />
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="55" id="per-v" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          <ResultDisplay label="Percentile" value={`${result.percentile.toFixed(1)}%`} large />
          <ResultDisplay label="Q1" value={result.q1} />
          <ResultDisplay label="Median" value={result.median} />
          <ResultDisplay label="Q3" value={result.q3} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
