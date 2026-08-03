'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ParallelogramCalculator() {
  const [baseStr, setBaseStr] = useState('10')
  const [heightStr, setHeightStr] = useState('6')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, area: 0 }
    const b = parseFloat(baseStr)
    const h = parseFloat(heightStr)

    if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    }

    const area = b * h
    return { error: null, area }
  }, [baseStr, heightStr])

  return (
    <FormCalculatorShell title="Parallelogram Area Solver" subtitle="Calculate boundary surface areas of parallelograms" badge="GEOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Base (b)" value={baseStr} onChange={setBaseStr} id="plg-b" />
          <RetroInput label="Height (h)" value={heightStr} onChange={setHeightStr} id="plg-h" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Area" value={results.area.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
