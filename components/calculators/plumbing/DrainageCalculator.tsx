'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DrainageCalculator() {
  const [fallStr, setFallStr] = useState('2') // inches
  const [runStr, setRunStr] = useState('10') // feet

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, slope: 0 }
    const f = parseFloat(fallStr)
    const r = parseFloat(runStr)

    if (isNaN(f) || isNaN(r) || f < 0 || r <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // slope = fall_inches / (run_feet * 12)
    const slope = f / (r * 12)
    return { error: null, slope: slope * 100 }
  }, [fallStr, runStr])

  return (
    <FormCalculatorShell title="Drainage Pipe Slope Solver" subtitle="Calculate fall slope ratios for drainage pipes" badge="PLUMBING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Drop Fall (inches)" value={fallStr} onChange={setFallStr} id="dr-f" />
          <RetroInput label="Horizontal Run (feet)" value={runStr} onChange={setRunStr} id="dr-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Slope Percentage" value={`${results.slope.toFixed(2)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
