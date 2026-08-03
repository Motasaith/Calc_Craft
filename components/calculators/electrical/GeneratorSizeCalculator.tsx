'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GeneratorSizeCalculator() {
  const [loadStr, setLoadStr] = useState('5000') // Watts continuous

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, size: 0 }
    const l = parseFloat(loadStr)
    if (isNaN(l) || l <= 0) return { ...defaultObj, error: 'Please enter a valid load.' }
    // General sizing: add 20-30% buffer
    const size = l * 1.25
    return { error: null, size }
  }, [loadStr])

  return (
    <FormCalculatorShell title="Generator Capacity Sizing Solver" subtitle="Calculate recommended backup generator output sizing with margins" badge="ELECTRICAL">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Continuous Power Load (Watts)" value={loadStr} onChange={setLoadStr} id="gs-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Required Generator Size" value={`${Math.round(results.size)} Watts`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
