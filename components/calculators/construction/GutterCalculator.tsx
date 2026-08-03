'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GutterCalculator() {
  const [lengthStr, setLengthStr] = useState('80') // feet

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, brackets: 0 }
    const len = parseFloat(lengthStr)
    if (isNaN(len) || len <= 0) return { ...defaultObj, error: 'Please enter a valid length.' }
    // standard: 1 gutter bracket support hanger every 2 feet
    const brackets = Math.ceil(len / 2) + 1
    return { error: null, brackets }
  }, [lengthStr])

  return (
    <FormCalculatorShell title="Roof Gutter Hanger Solver" subtitle="Calculate required gutter support brackets spacing count" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Gutter Run Length (feet)" value={lengthStr} onChange={setLengthStr} id="gt-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Brackets Required" value={results.brackets.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
