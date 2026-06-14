'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function CorrelationCalculator() {
  const [xData, setXData] = useState('1,2,3,4,5')
  const [yData, setYData] = useState('2,4,6,8,10')
  const [result, setResult] = useState<{r:number,interpretation:string}|null>(null)

  const calculate = () => {
    const x = xData.split(',').map(Number).filter(n => !isNaN(n))
    const y = yData.split(',').map(Number).filter(n => !isNaN(n))
    if (x.length < 2 || x.length !== y.length) { setResult(null); return }
    const n = x.length
    const sumX = x.reduce((a,b) => a+b, 0), sumY = y.reduce((a,b) => a+b, 0)
    const sumXY = x.reduce((s,xi,i) => s + xi*y[i], 0)
    const sumX2 = x.reduce((s,xi) => s + xi*xi, 0)
    const sumY2 = y.reduce((s,yi) => s + yi*yi, 0)
    const r = (n*sumXY - sumX*sumY) / Math.sqrt((n*sumX2 - sumX*sumX)*(n*sumY2 - sumY*sumY))
    const absR = Math.abs(r)
    let interp = absR > 0.7 ? 'Strong' : absR > 0.3 ? 'Moderate' : 'Weak'
    interp += r > 0 ? ' positive' : ' negative'
    setResult({ r, interpretation: interp })
  }

  return (
    <FormCalculatorShell title="Pearson Correlation" badge="STATISTICS">
      <RetroInput label="X values (comma sep)" value={xData} onChange={setXData} placeholder="1,2,3,4,5" id="cor-x" />
      <RetroInput label="Y values (comma sep)" value={yData} onChange={setYData} placeholder="2,4,6,8,10" id="cor-y" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="r" value={result.r.toFixed(4)} large />
          <ResultDisplay label="Strength" value={result.interpretation} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
