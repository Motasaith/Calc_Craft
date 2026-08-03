'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SodCalculator() {
  const [areaStr, setAreaStr] = useState('500')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, rolls: 0 }
    const a = parseFloat(areaStr)
    if (isNaN(a) || a <= 0) return { ...defaultObj, error: 'Please enter valid area.' }
    // 1 roll of sod is typically 9 sq ft (1 yard x 3 yards approx)
    const rolls = a / 9
    return { error: null, rolls: Math.ceil(rolls) }
  }, [areaStr])

  return (
    <FormCalculatorShell title="Lawn Sod Roll Solver" subtitle="Calculate standard sod rolls required for turf installations" badge="LANDSCAPING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Lawn Area (sq ft)" value={areaStr} onChange={setAreaStr} id="sd-a" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Sod Rolls Required" value={results.rolls.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
