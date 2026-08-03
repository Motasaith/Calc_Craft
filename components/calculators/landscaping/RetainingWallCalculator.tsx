'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RetainingWallCalculator() {
  const [lengthStr, setLengthStr] = useState('20') // feet
  const [heightStr, setHeightStr] = useState('3') // feet

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, blocks: 0 }
    const l = parseFloat(lengthStr)
    const h = parseFloat(heightStr)

    if (isNaN(l) || isNaN(h) || l <= 0 || h <= 0) {
      return { ...defaultObj, error: 'Please enter valid wall dimensions.' }
    }

    // Standard block dimensions: 12" length, 4" height
    const blockLengthFt = 1
    const blockHeightFt = 0.333
    const rowBlocks = Math.ceil(l / blockLengthFt)
    const rows = Math.ceil(h / blockHeightFt)
    const blocks = rowBlocks * rows

    return { error: null, blocks }
  }, [lengthStr, heightStr])

  return (
    <FormCalculatorShell title="Retaining Wall Blocks Solver" subtitle="Estimate concrete blocks count needed for landscaping retaining walls" badge="LANDSCAPING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Wall Length (feet)" value={lengthStr} onChange={setLengthStr} id="rw-l" />
          <RetroInput label="Wall Height (feet)" value={heightStr} onChange={setHeightStr} id="rw-h" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Total Blocks Required" value={results.blocks.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
