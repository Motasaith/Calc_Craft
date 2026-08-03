'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RainfallVolumeCalculator() {
  const [areaStr, setAreaStr] = useState('1000') // sq ft
  const [rainStr, setRainStr] = useState('1') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, gallons: 0, steps: [] as string[] }
    const a = parseFloat(areaStr)
    const r = parseFloat(rainStr)
    if (isNaN(a) || isNaN(r) || a <= 0 || r < 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const gallons = a * r * 0.623379
    return {
      error: null,
      gallons,
      steps: [
        `Formula: Volume = Area × Depth`,
        `1 inch rain on 1 sq ft = 0.623379 gallons`,
        `Total volume = ${gallons.toFixed(1)} gallons`
      ]
    }
  }, [areaStr, rainStr])

  return (
    <FormCalculatorShell title="Rainwater Harvest Volume Solver" subtitle="Calculate rainwater gallons collected from a roof or surface area" badge="AGRICULTURE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Surface Area (sq ft)" value={areaStr} onChange={setAreaStr} id="rf-a" />
          <RetroInput label="Rainfall Depth (inches)" value={rainStr} onChange={setRainStr} id="rf-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Rainwater Volume (gallons)" value={results.gallons.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
