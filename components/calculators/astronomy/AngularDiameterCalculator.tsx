'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AngularDiameterCalculator() {
  const [sizeStr, setSizeStr] = useState('3474000') // Moon size (m)
  const [distStr, setDistStr] = useState('384400000') // Moon distance (m)

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, angle: 0 }
    const d = parseFloat(sizeStr)
    const D = parseFloat(distStr)
    if (isNaN(d) || isNaN(D) || d <= 0 || D <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const angle = 2 * Math.atan(d / (2 * D)) * 180 / Math.PI
    return { error: null, angle }
  }, [sizeStr, distStr])

  return (
    <FormCalculatorShell title="Angular Diameter Calculator" subtitle="Solve apparent angular size" badge="ASTRONOMY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Actual Size d (m)" value={sizeStr} onChange={setSizeStr} id="ad-d" />
          <RetroInput label="Distance D (m)" value={distStr} onChange={setDistStr} id="ad-dist" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Angular Diameter (degrees)" value={results.angle.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
