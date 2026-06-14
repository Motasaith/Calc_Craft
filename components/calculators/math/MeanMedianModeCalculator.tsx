'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function MeanMedianModeCalculator() {
  const [data, setData] = useState('')
  const [result, setResult] = useState<{mean:number,median:number,mode:string,range:number,n:number}|null>(null)

  const calculate = () => {
    const nums = data.split(/[,\s]+/).map(Number).filter(n => !isNaN(n)).sort((a,b) => a-b)
    if (nums.length === 0) { setResult(null); return }
    const n = nums.length
    const mean = nums.reduce((a,b) => a+b,0) / n
    const median = n % 2 === 1 ? nums[Math.floor(n/2)] : (nums[n/2-1] + nums[n/2]) / 2
    const freq: Record<number,number> = {}
    nums.forEach(x => freq[x] = (freq[x]||0)+1)
    const maxFreq = Math.max(...Object.values(freq))
    const modes = Object.entries(freq).filter(([_,f]) => f === maxFreq).map(([k,_]) => Number(k))
    const modeStr = modes.length === nums.length ? 'No mode' : modes.join(', ')
    setResult({ mean, median, mode: modeStr, range: nums[n-1] - nums[0], n })
  }

  return (
    <FormCalculatorShell title="Mean, Median, Mode" badge="MATH">
      <RetroInput label="Data (comma or space separated)" value={data} onChange={setData} placeholder="1, 2, 2, 3, 4, 4, 4, 5" id="mmm-data" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Mean" value={result.mean.toFixed(4)} />
          <ResultDisplay label="Median" value={result.median.toFixed(4)} />
          <ResultDisplay label="Mode" value={result.mode} />
          <ResultDisplay label="Range" value={result.range.toFixed(4)} />
          <ResultDisplay label="Count" value={result.n} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
