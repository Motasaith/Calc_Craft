'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FieldOfViewCalculator() {
  const [focalLengthStr, setFocalLengthStr] = useState('50') // mm
  const [sensorWidthStr, setSensorWidthStr] = useState('36') // mm (full frame)

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, fov: 0 }
    const f = parseFloat(focalLengthStr)
    const w = parseFloat(sensorWidthStr)
    if (isNaN(f) || isNaN(w) || f <= 0 || w <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const fov = 2 * Math.atan(w / (2 * f)) * 180 / Math.PI
    return { error: null, fov }
  }, [focalLengthStr, sensorWidthStr])

  return (
    <FormCalculatorShell title="Field of View Calculator" subtitle="Calculate sensor capture coverage angle" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Focal Length (mm)" value={focalLengthStr} onChange={setFocalLengthStr} id="fov-f" />
          <RetroInput label="Sensor Width (mm)" value={sensorWidthStr} onChange={setSensorWidthStr} id="fov-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Horizontal FOV (degrees)" value={results.fov.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
