'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RebarCalculator() {
  const [lengthStr, setLengthStr] = useState('100') // linear feet
  const [spacingStr, setSpacingStr] = useState('18') // spacing inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, count: 0 }
    const len = parseFloat(lengthStr)
    const space = parseFloat(spacingStr)

    if (isNaN(len) || isNaN(space) || len <= 0 || space <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const spacingFeet = space / 12
    const count = len / spacingFeet
    return { error: null, count: Math.ceil(count) }
  }, [lengthStr, spacingStr])

  return (
    <FormCalculatorShell title="Concrete Rebar Grid Solver" subtitle="Calculate required rebar rods count based on mesh spacing" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Slab Perimeter/Length (feet)" value={lengthStr} onChange={setLengthStr} id="rb-l" />
          <RetroInput label="Grid Spacing (inches)" value={spacingStr} onChange={setSpacingStr} id="rb-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Rebar Rods Required" value={results.count.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
