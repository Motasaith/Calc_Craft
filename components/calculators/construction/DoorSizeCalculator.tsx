'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DoorSizeCalculator() {
  const [widthStr, setWidthStr] = useState('36') // inches
  const [heightStr, setHeightStr] = useState('80') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, roughW: 0, roughH: 0 }
    const w = parseFloat(widthStr)
    const h = parseFloat(heightStr)

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      return { ...defaultObj, error: 'Please enter valid dimensions.' }
    }

    // rough opening = door size + 2 inches width + 2.5 inches height
    const roughW = w + 2
    const roughH = h + 2.5

    return { error: null, roughW, roughH }
  }, [widthStr, heightStr])

  return (
    <FormCalculatorShell title="Door Rough Opening Solver" subtitle="Calculate rough framing dimensions required for standard prehung doors" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Standard Door Width (inches)" value={widthStr} onChange={setWidthStr} id="ds-w" />
          <RetroInput label="Standard Door Height (inches)" value={heightStr} onChange={setHeightStr} id="ds-h" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Rough Opening Width" value={`${results.roughW.toFixed(1)}"`} />
              <ResultDisplay label="Rough Opening Height" value={`${results.roughH.toFixed(1)}"`} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
