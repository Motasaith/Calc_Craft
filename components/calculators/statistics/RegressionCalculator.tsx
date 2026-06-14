'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function RegressionCalculator() {
  const [xData, setXData] = useState('1,2,3,4,5')
  const [yData, setYData] = useState('2,3,5,4,6')
  const [result, setResult] = useState<{slope:number,intercept:number,r2:number}|null>(null)

  const calculate = () => {
    const x = xData.split(',').map(Number).filter(n => !isNaN(n))
    const y = yData.split(',').map(Number).filter(n => !isNaN(n))
    if (x.length < 2 || x.length !== y.length) { setResult(null); return }
    const n = x.length
    const sumX = x.reduce((a,b) => a+b, 0), sumY = y.reduce((a,b) => a+b, 0)
    const sumXY = x.reduce((s,xi,i) => s + xi*y[i], 0)
    const sumX2 = x.reduce((s,xi) => s + xi*xi, 0)
    const sumY2 = y.reduce((s,yi) => s + yi*yi, 0)
    const slope = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX)
    const intercept = (sumY - slope*sumX) / n
    const r = (n*sumXY - sumX*sumY) / Math.sqrt((n*sumX2 - sumX*sumX)*(n*sumY2 - sumY*sumY))
    setResult({ slope, intercept, r2: r*r })
  }

  return (
    <FormCalculatorShell title="Linear Regression" badge="STATISTICS">
      <RetroInput label="X values" value={xData} onChange={setXData} placeholder="1,2,3,4,5" id="reg-x" />
      <RetroInput label="Y values" value={yData} onChange={setYData} placeholder="2,3,5,4,6" id="reg-y" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Slope (m)" value={result.slope.toFixed(4)} />
          <ResultDisplay label="Intercept (b)" value={result.intercept.toFixed(4)} />
          <ResultDisplay label="R²" value={result.r2.toFixed(4)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
