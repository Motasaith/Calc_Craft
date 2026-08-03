'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SidingCalculator() {
  const [areaStr, setAreaStr] = useState('1200') // sq ft

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, squares: 0 }
    const a = parseFloat(areaStr)
    if (isNaN(a) || a <= 0) return { ...defaultObj, error: 'Please enter a valid area.' }
    // 1 square of siding covers 100 sq ft. Add 10% waste buffer.
    const squares = (a * 1.1) / 100
    return { error: null, squares }
  }, [areaStr])

  return (
    <FormCalculatorShell title="Wall Siding Squares Solver" subtitle="Calculate siding material squares required with 10% waste margins" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Wall Area to Cover (sq ft)" value={areaStr} onChange={setAreaStr} id="sdg-a" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Siding Squares Required" value={results.squares.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
