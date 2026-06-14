'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function OutlierCalculator() {
  const [data, setData] = useState('10,12,14,100,15,13,11')
  const [method, setMethod] = useState<'iqr' | 'zscore'>('iqr')
  const [result, setResult] = useState<{outliers:number[],q1:number,q3:number}|null>(null)

  const calculate = () => {
    const arr = data.split(',').map(Number).filter(n => !isNaN(n)).sort((a,b) => a-b)
    if (arr.length < 4) { setResult(null); return }
    if (method === 'iqr') {
      const q1 = arr[Math.floor(arr.length * 0.25)]
      const q3 = arr[Math.floor(arr.length * 0.75)]
      const iqr = q3 - q1
      const outliers = arr.filter(x => x < q1 - 1.5*iqr || x > q3 + 1.5*iqr)
      setResult({ outliers, q1, q3 })
    } else {
      const mean = arr.reduce((a,b) => a+b,0)/arr.length
      const std = Math.sqrt(arr.reduce((s,x) => s + Math.pow(x-mean,2),0)/arr.length)
      const outliers = arr.filter(x => Math.abs((x-mean)/std) > 2)
      setResult({ outliers, q1: 0, q3: 0 })
    }
  }

  return (
    <FormCalculatorShell title="Outlier Detection" badge="STATISTICS">
      <RetroInput label="Data (comma sep)" value={data} onChange={setData} placeholder="10,12,14,100,15,13,11" id="out-d" />
      <RetroSelect label="Method" value={method} onChange={(v) => { setMethod(v as any); setResult(null) }} options={[{value:'iqr',label:'IQR Method'},{value:'zscore',label:'Z-Score > 2'}]} id="out-m" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Detect</RetroActionButton></div>
      {result && (
        <div className="mt-4">
          <ResultDisplay label="Outliers" value={result.outliers.length > 0 ? result.outliers.join(', ') : 'None detected'} large />
          {method === 'iqr' && <div className="grid grid-cols-2 gap-2 mt-2"><ResultDisplay label="Q1" value={result.q1} /><ResultDisplay label="Q3" value={result.q3} /></div>}
        </div>
      )}
    </FormCalculatorShell>
  )
}
