'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CropFactorCalculator() {
  const [focalLengthStr, setFocalLengthStr] = useState('50')
  const [cropFactorStr, setCropFactorStr] = useState('1.5') // APS-C

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, equivalent: 0 }
    const f = parseFloat(focalLengthStr)
    const c = parseFloat(cropFactorStr)
    if (isNaN(f) || isNaN(c) || f <= 0 || c <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const equivalent = f * c
    return { error: null, equivalent }
  }, [focalLengthStr, cropFactorStr])

  return (
    <FormCalculatorShell title="Crop Factor Calculator" subtitle="Find full-frame 35mm equivalent focal lengths" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Actual Focal Length (mm)" value={focalLengthStr} onChange={setFocalLengthStr} id="cf-f" />
          <RetroInput label="Crop Factor multiplier" value={cropFactorStr} onChange={setCropFactorStr} id="cf-c" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Equivalent Focal Length (mm)" value={results.equivalent.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
