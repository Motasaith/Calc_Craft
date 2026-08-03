'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PlantSpacingCalculator() {
  const [areaStr, setAreaStr] = useState('100') // sq ft
  const [spacingStr, setSpacingStr] = useState('12') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, count: 0 }
    const a = parseFloat(areaStr)
    const s = parseFloat(spacingStr)

    if (isNaN(a) || isNaN(s) || a <= 0 || s <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const spacingFt = s / 12
    const plantArea = spacingFt * spacingFt
    const count = a / plantArea

    return { error: null, count: Math.floor(count) }
  }, [areaStr, spacingStr])

  return (
    <FormCalculatorShell title="Plant Grid Spacing Solver" subtitle="Calculate plant count needed inside spacing grids" badge="LANDSCAPING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Garden Bed Area (sq ft)" value={areaStr} onChange={setAreaStr} id="ps-a" />
          <RetroInput label="Plant Spacing (inches)" value={spacingStr} onChange={setSpacingStr} id="ps-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Plant Count" value={results.count.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
