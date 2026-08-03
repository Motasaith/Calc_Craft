'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function OutlierCalculator() {
  const [data, setData] = useState('10, 12, 11, 15, 13, 22, 10, 5')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, q1: 0, q3: 0, iqr: 0, outliers: '', steps: [] as string[] }
    const nums = data.split(/[,\s]+/).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b)
    if (nums.length < 4) return { ...defaultObj, error: 'Please enter at least 4 numbers.' }
    
    const n = nums.length
    const getMedian = (arr: number[]) => {
      const len = arr.length
      if (len === 0) return 0
      return len % 2 === 1 ? arr[Math.floor(len/2)] : (arr[len/2 - 1] + arr[len/2]) / 2
    }

    const q1 = getMedian(nums.slice(0, Math.floor(n/2)))
    const q3 = getMedian(nums.slice(Math.ceil(n/2)))
    const iqr = q3 - q1
    const lowerBound = q1 - 1.5 * iqr
    const upperBound = q3 + 1.5 * iqr

    const outliers = nums.filter(x => x < lowerBound || x > upperBound)

    return {
      error: null,
      q1, q3, iqr,
      outliers: outliers.length ? outliers.join(', ') : 'None',
      steps: [
        `Sorted Data: ${nums.join(', ')}`,
        `Q1 (25th percentile) = ${q1}`,
        `Q3 (75th percentile) = ${q3}`,
        `IQR = Q3 - Q1 = ${iqr}`,
        `Fence Bounds = [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}]`
      ]
    }
  }, [data])

  return (
    <FormCalculatorShell title="Outlier Data Detector" subtitle="Find interquartile range (IQR) and identify outlier values" badge="STATISTICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Data (comma or space separated)" value={data} onChange={setData} id="out-data" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Outliers Detected" value={results.outliers} large />
                <ResultDisplay label="IQR" value={results.iqr.toString()} />
                <ResultDisplay label="Q1 (Lower)" value={results.q1.toString()} />
                <ResultDisplay label="Q3 (Upper)" value={results.q3.toString()} />
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
