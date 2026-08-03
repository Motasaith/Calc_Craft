'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CorrelationCalculator() {
  const [xStr, setXStr] = useState('1, 2, 3, 4, 5')
  const [yStr, setYStr] = useState('2, 4, 5, 4, 5')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, r: 0 }
    const xArr = xStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
    const yArr = yStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))

    if (xArr.length !== yArr.length || xArr.length < 2) {
      return { ...defaultObj, error: 'X and Y datasets must have the same size and at least 2 points.' }
    }

    const n = xArr.length
    const sumX = xArr.reduce((a, b) => a + b, 0)
    const sumY = yArr.reduce((a, b) => a + b, 0)
    const sumXY = xArr.reduce((acc, val, i) => acc + val * yArr[i], 0)
    const sumX2 = xArr.reduce((acc, val) => acc + val * val, 0)
    const sumY2 = yArr.reduce((acc, val) => acc + val * val, 0)

    const num = n * sumXY - sumX * sumY
    const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

    if (den === 0) return { ...defaultObj, error: 'Standard deviation is zero.' }
    const r = num / den

    return { error: null, r }
  }, [xStr, yStr])

  return (
    <FormCalculatorShell title="Pearson Correlation Solver" subtitle="Calculate correlation coefficient r between two numerical arrays" badge="STATISTICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Dataset X (comma-separated)" value={xStr} onChange={setXStr} id="cr-x" />
          <RetroInput label="Dataset Y (comma-separated)" value={yStr} onChange={setYStr} id="cr-y" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Pearson Coefficient (r)" value={results.r.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
