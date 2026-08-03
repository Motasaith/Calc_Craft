'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HistogramCalculator() {
  const [dataStr, setDataStr] = useState('10, 12, 23, 25, 29, 32, 40')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, bins: [] as string[] }
    const arr = dataStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
    if (arr.length < 2) return { ...defaultObj, error: 'Please enter at least 2 points.' }
    // Simple frequency binning
    const min = Math.min(...arr)
    const max = Math.max(...arr)
    const width = (max - min) / 3
    let bins = [`[${min.toFixed(1)} - ${(min+width).toFixed(1)}]: ${arr.filter(x => x >= min && x <= min+width).length}`,
                   `[${(min+width).toFixed(1)} - ${(min+2*width).toFixed(1)}]: ${arr.filter(x => x > min+width && x <= min+2*width).length}`,
                   `[${(min+2*width).toFixed(1)} - ${max.toFixed(1)}]: ${arr.filter(x => x > min+2*width && x <= max).length}`]
    return { error: null, bins }
  }, [dataStr])

  return (
    <FormCalculatorShell title="Frequency Histogram Distribution Solver" subtitle="Distribute data series arrays into equal interval frequency bins" badge="STATISTICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Data Values Array" value={dataStr} onChange={setDataStr} id="hs-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="space-y-2 font-mono text-sm">
              <p className="text-xs font-bold font-sans text-neutral-600">Frequency Table Bins</p>
              {results.bins.map((bin, idx) => (
                <div key={idx} className="bg-neutral-50 p-3 rounded border border-neutral-300">
                  {bin}
                </div>
              ))}
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
