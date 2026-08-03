'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WaterFeatureCalculator() {
  const [lengthStr, setLengthStr] = useState('8')
  const [widthStr, setWidthStr] = useState('6')
  const [depthStr, setDepthStr] = useState('3') // feet

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, gallons: 0 }
    const l = parseFloat(lengthStr)
    const w = parseFloat(widthStr)
    const d = parseFloat(depthStr)

    if (isNaN(l) || isNaN(w) || isNaN(d) || l <= 0 || w <= 0 || d <= 0) {
      return { ...defaultObj, error: 'Please enter valid pond dimensions.' }
    }

    const volumeCuFt = l * w * d
    const gallons = volumeCuFt * 7.48052 // 7.48 gallons in 1 cu ft

    return { error: null, gallons }
  }, [lengthStr, widthStr, depthStr])

  return (
    <FormCalculatorShell title="Pond Volume Solver" subtitle="Calculate water capacity volume in gallons for garden water ponds" badge="LANDSCAPING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Pond Length (feet)" value={lengthStr} onChange={setLengthStr} id="wf-l" />
          <RetroInput label="Pond Width (feet)" value={widthStr} onChange={setWidthStr} id="wf-w" />
          <RetroInput label="Pond Depth (feet)" value={depthStr} onChange={setDepthStr} id="wf-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Water Volume Capacity" value={`${Math.round(results.gallons).toLocaleString()} Gallons`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
