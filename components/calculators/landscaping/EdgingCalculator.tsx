'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function EdgingCalculator() {
  const [perimeterStr, setPerimeterStr] = useState('100')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, feet: 0 }
    const p = parseFloat(perimeterStr)
    if (isNaN(p) || p <= 0) return { ...defaultObj, error: 'Please enter a valid perimeter.' }
    return { error: null, feet: p }
  }, [perimeterStr])

  return (
    <FormCalculatorShell title="Garden Edging Border Solver" subtitle="Calculate required linear border feet for garden beds" badge="LANDSCAPING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Border Perimeter (feet)" value={perimeterStr} onChange={setPerimeterStr} id="ed-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Border Edging Required" value={`${results.feet.toFixed(1)} feet`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
