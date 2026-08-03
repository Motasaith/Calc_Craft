'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ScreedCalculator() {
  const [areaStr, setAreaStr] = useState('150')
  const [depthStr, setDepthStr] = useState('2') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, volumeM3: 0 }
    const a = parseFloat(areaStr)
    const d = parseFloat(depthStr)

    if (isNaN(a) || isNaN(d) || a <= 0 || d <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const ft3 = a * (d / 12)
    const volumeM3 = ft3 * 0.0283168 // convert cubic feet to cubic meters
    return { error: null, volumeM3 }
  }, [areaStr, depthStr])

  return (
    <FormCalculatorShell title="Floor Screed Volume Solver" subtitle="Calculate required cubic meters of floor screed concrete" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Floor Area (sq ft)" value={areaStr} onChange={setAreaStr} id="scr-a" />
          <RetroInput label="Screed Depth (inches)" value={depthStr} onChange={setDepthStr} id="scr-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Screed Required (m³)" value={results.volumeM3.toFixed(3)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
