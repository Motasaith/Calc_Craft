'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TankSizeCalculator() {
  const [diameterStr, setDiameterStr] = useState('4') // ft
  const [heightStr, setHeightStr] = useState('6') // ft

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, gallons: 0, steps: [] as string[] }
    const d = parseFloat(diameterStr)
    const h = parseFloat(heightStr)
    if (isNaN(d) || isNaN(h) || d <= 0 || h <= 0) return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    const r = d / 2
    const volCuFt = Math.PI * r * r * h
    const gallons = volCuFt * 7.48052
    return {
      error: null,
      gallons,
      steps: [
        `Volume = π × r² × H = π × ${r}² × ${h} = ${volCuFt.toFixed(2)} cu ft`,
        `Total capacity = Volume × 7.481 = ${gallons.toFixed(1)} gallons`
      ]
    }
  }, [diameterStr, heightStr])

  return (
    <FormCalculatorShell title="Cylindrical Tank Capacity Solver" subtitle="Calculate water volume capacity of vertical storage tanks" badge="PLUMBING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Diameter (ft)" value={diameterStr} onChange={setDiameterStr} id="tk-d" />
          <RetroInput label="Height (ft)" value={heightStr} onChange={setHeightStr} id="tk-h" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Tank capacity (gallons)" value={results.gallons.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
