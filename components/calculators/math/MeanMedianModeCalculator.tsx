'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MeanMedianModeCalculator() {
  const [data, setData] = useState('1, 2, 2, 3, 4, 4, 4, 5')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      mean: 0,
      median: 0,
      mode: '',
      range: 0,
      n: 0,
      steps: [] as string[]
    }

    const nums = data.split(/[,\s]+/).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b)
    if (nums.length === 0) {
      return { ...defaultObj, error: 'Please enter a valid list of numbers.' }
    }

    const n = nums.length
    const mean = nums.reduce((a, b) => a + b, 0) / n
    const median = n % 2 === 1 ? nums[Math.floor(n / 2)] : (nums[n / 2 - 1] + nums[n / 2]) / 2

    const freq: Record<number, number> = {}
    nums.forEach(x => (freq[x] = (freq[x] || 0) + 1))
    const maxFreq = Math.max(...Object.values(freq))
    const modes = Object.entries(freq).filter(([_, f]) => f === maxFreq).map(([k, _]) => Number(k))
    const modeStr = modes.length === nums.length ? 'No mode' : modes.join(', ')
    const range = nums[n - 1] - nums[0]

    const steps = [
      `Sorted List: ${nums.join(', ')}`,
      `Count (n) = ${n}`,
      `Mean (average) = Sum / n = ${mean.toFixed(4)}`,
      `Median (middle value) = ${median.toFixed(4)}`,
      `Mode (most frequent value) = ${modeStr} (max frequency: ${maxFreq})`
    ]

    return {
      error: null,
      mean,
      median,
      mode: modeStr,
      range,
      n,
      steps
    }
  }, [data])

  return (
    <FormCalculatorShell title="Mean, Median, Mode" subtitle="Find central tendencies, range, and counts of a dataset" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Data (comma or space separated)" value={data} onChange={setData} placeholder="1, 2, 2, 3, 4, 4, 4, 5" id="mmm-data" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <ResultDisplay label="Mean" value={results.mean.toFixed(4)} />
                <ResultDisplay label="Median" value={results.median.toFixed(4)} />
                <ResultDisplay label="Mode" value={results.mode} />
                <ResultDisplay label="Range" value={results.range.toFixed(4)} />
                <ResultDisplay label="Count" value={results.n} />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Mathematical Steps</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results.error}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
