'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TileCalculator() {
  const [areaStr, setAreaStr] = useState('100') // sq ft
  const [tileSizeStr, setTileSizeStr] = useState('12') // inches (e.g. 12x12 tile)

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, count: 0, steps: [] as string[] }
    const a = parseFloat(areaStr)
    const t = parseFloat(tileSizeStr)
    if (isNaN(a) || isNaN(t) || a <= 0 || t <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const tileAreaSqFt = (t * t) / 144
    const count = a / tileAreaSqFt
    return {
      error: null,
      count: Math.ceil(count),
      steps: [
        `Tile Area = (${t} × ${t}) / 144 = ${tileAreaSqFt.toFixed(3)} sq ft`,
        `Tiles needed = Area / Tile Area = ${Math.ceil(count)} tiles`
      ]
    }
  }, [areaStr, tileSizeStr])

  return (
    <FormCalculatorShell title="Tile Count Solver" subtitle="Calculate floor or backsplash tiles required" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Floor Area (sq ft)" value={areaStr} onChange={setAreaStr} id="tl-a" />
          <RetroInput label="Tile Size (inches, side length)" value={tileSizeStr} onChange={setTileSizeStr} id="tl-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Tiles Needed" value={results.count.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
