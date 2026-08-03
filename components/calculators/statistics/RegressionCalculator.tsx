'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RegressionCalculator() {
  const [xStr, setXStr] = useState('1, 2, 3, 4, 5')
  const [yStr, setYStr] = useState('2, 4, 5, 4, 5')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, slope: 0, intercept: 0 }
    const xArr = xStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
    const yArr = yStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))

    if (xArr.length !== yArr.length || xArr.length < 2) {
      return { ...defaultObj, error: 'Datasets must be of equal size and contain at least 2 points.' }
    }

    const n = xArr.length
    const sumX = xArr.reduce((a, b) => a + b, 0)
    const sumY = yArr.reduce((a, b) => a + b, 0)
    const sumXY = xArr.reduce((acc, val, i) => acc + val * yArr[i], 0)
    const sumX2 = xArr.reduce((acc, val) => acc + val * val, 0)

    const num = n * sumXY - sumX * sumY
    const den = n * sumX2 - sumX * sumX

    if (den === 0) return { ...defaultObj, error: 'Denominator is zero (cannot solve slope).' }

    const slope = num / den
    const intercept = (sumY - slope * sumX) / n

    return { error: null, slope, intercept }
  }, [xStr, yStr])

  return (
    <FormCalculatorShell title="Linear Regression Line Solver" subtitle="Determine line coefficients y = m·x + b from datasets" badge="STATISTICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Independent Variable X" value={xStr} onChange={setXStr} id="rg-x" />
          <RetroInput label="Dependent Variable Y" value={yStr} onChange={setYStr} id="rg-y" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Slope (m)" value={results.slope.toFixed(4)} />
              <ResultDisplay label="Y-Intercept (b)" value={results.intercept.toFixed(4)} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
