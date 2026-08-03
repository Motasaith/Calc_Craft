'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RoofingCalculator() {
  const [areaStr, setAreaStr] = useState('1500') // footprint area
  const [slopeStr, setSlopeStr] = useState('4') // rise over 12

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, squares: 0 }
    const a = parseFloat(areaStr)
    const s = parseFloat(slopeStr)

    if (isNaN(a) || isNaN(s) || a <= 0 || s < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // Slope multiplier factor
    const pitch = s / 12
    const factor = Math.sqrt(1 + pitch * pitch)
    const actualArea = a * factor
    const squares = actualArea / 100 // 1 shingle square = 100 sq ft

    return { error: null, squares }
  }, [areaStr, slopeStr])

  return (
    <FormCalculatorShell title="Roofing Shingle Squares Solver" subtitle="Calculate shingle squares needed based on roof footprint and pitch" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Footprint Area (sq ft)" value={areaStr} onChange={setAreaStr} id="rf-a" />
          <RetroInput label="Pitch Slope (Rise per 12)" value={slopeStr} onChange={setSlopeStr} id="rf-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Roofing Squares Required" value={results.squares.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
