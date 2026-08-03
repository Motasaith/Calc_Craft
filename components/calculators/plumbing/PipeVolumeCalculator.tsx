'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PipeVolumeCalculator() {
  const [diameterStr, setDiameterStr] = useState('2') // inches
  const [lengthStr, setLengthStr] = useState('50') // feet

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, gallons: 0, steps: [] as string[] }
    const d = parseFloat(diameterStr)
    const l = parseFloat(lengthStr)
    if (isNaN(d) || isNaN(l) || d <= 0 || l <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    // radius in feet
    const rFt = (d / 2) / 12
    const volCuFt = Math.PI * rFt * rFt * l
    const gallons = volCuFt * 7.48052 // 7.48 gallons per cu ft
    return {
      error: null,
      gallons,
      steps: [
        `Pipe Radius = ${rFt.toFixed(4)} ft`,
        `Cubic Feet Volume = π × r² × L = ${volCuFt.toFixed(3)} cu ft`,
        `Total Gallons = Volume × 7.481 = ${gallons.toFixed(2)} gallons`
      ]
    }
  }, [diameterStr, lengthStr])

  return (
    <FormCalculatorShell title="Pipe Volume Water Solver" subtitle="Calculate water capacity inside plumbing pipes" badge="PLUMBING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Pipe Inside Diameter (inches)" value={diameterStr} onChange={setDiameterStr} id="pv-d" />
          <RetroInput label="Pipe Length (feet)" value={lengthStr} onChange={setLengthStr} id="pv-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Water Volume (gallons)" value={results.gallons.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
