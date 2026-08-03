'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PercentileCalculator() {
  const [dataStr, setDataStr] = useState('10, 20, 30, 40, 50')
  const [percStr, setPercStr] = useState('80') // percentile target

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, value: 0 }
    const arr = dataStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n)).sort((a, b) => a - b)
    const p = parseFloat(percStr)

    if (arr.length < 1 || isNaN(p) || p < 0 || p > 100) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // Percentile index using linear interpolation
    const idx = (p / 100) * (arr.length - 1)
    const low = Math.floor(idx)
    const high = Math.ceil(idx)
    const weight = idx - low
    const value = arr[low] + weight * (arr[high] - arr[low])

    return { error: null, value }
  }, [dataStr, percStr])

  return (
    <FormCalculatorShell title="Percentile Value Solver" subtitle="Calculate target percentile values from a series dataset" badge="STATISTICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Dataset Array (comma-separated)" value={dataStr} onChange={setDataStr} id="pc-d" />
          <RetroInput label="Percentile Rank (0 to 100)" value={percStr} onChange={setPercStr} id="pc-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Percentile Target Value" value={results.value.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
