'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FuseSizeCalculator() {
  const [currentStr, setCurrentStr] = useState('12') // Amps continuous

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, size: 0 }
    const i = parseFloat(currentStr)
    if (isNaN(i) || i <= 0) return { ...defaultObj, error: 'Please enter a valid current.' }
    // Standard NEC sizing: 125% of continuous load
    const size = i * 1.25
    return { error: null, size }
  }, [currentStr])

  return (
    <FormCalculatorShell title="Electrical Fuse Capacity Solver" subtitle="Calculate standard NEC fuse sizes based on continuous currents" badge="ELECTRICAL">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Continuous Load (Amps)" value={currentStr} onChange={setCurrentStr} id="fs-i" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Recommended Fuse/Breaker Size" value={`${results.size.toFixed(1)} Amps`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
