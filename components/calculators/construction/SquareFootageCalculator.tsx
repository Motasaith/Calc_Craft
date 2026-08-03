'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SquareFootageCalculator() {
  const [widthStr, setWidthStr] = useState('12')
  const [lengthStr, setLengthStr] = useState('15')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, sqft: 0 }
    const w = parseFloat(widthStr)
    const l = parseFloat(lengthStr)

    if (isNaN(w) || isNaN(l) || w <= 0 || l <= 0) {
      return { ...defaultObj, error: 'Please enter valid dimensions.' }
    }

    const sqft = w * l
    return { error: null, sqft }
  }, [widthStr, lengthStr])

  return (
    <FormCalculatorShell title="Square Footage Solver" subtitle="Calculate room square footages from side dimensions" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Width (feet)" value={widthStr} onChange={setWidthStr} id="sf-w" />
          <RetroInput label="Length (feet)" value={lengthStr} onChange={setLengthStr} id="sf-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Total Area" value={`${results.sqft.toFixed(1)} sq ft`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
