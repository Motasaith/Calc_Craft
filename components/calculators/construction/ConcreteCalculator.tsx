'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ConcreteCalculator() {
  const [lengthStr, setLengthStr] = useState('10') // ft
  const [widthStr, setWidthStr] = useState('10') // ft
  const [thicknessStr, setThicknessStr] = useState('4') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, cubicYards: 0, bags80: 0, steps: [] as string[] }
    const l = parseFloat(lengthStr)
    const w = parseFloat(widthStr)
    const t = parseFloat(thicknessStr)
    if (isNaN(l) || isNaN(w) || isNaN(t) || l <= 0 || w <= 0 || t <= 0) return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    const cubicFeet = l * w * (t / 12)
    const cubicYards = cubicFeet / 27
    const bags80 = cubicFeet / 0.6 // 80lb bag yields 0.6 cu ft
    return {
      error: null,
      cubicYards,
      bags80: Math.ceil(bags80),
      steps: [
        `Volume = ${l} × ${w} × (${t}/12) = ${cubicFeet.toFixed(2)} cu ft`,
        `Cubic Yards = ${cubicFeet.toFixed(2)} / 27 = ${cubicYards.toFixed(2)} yd³`,
        `Bags needed (80 lbs) = ${cubicFeet.toFixed(2)} / 0.6 = ${Math.ceil(bags80)} bags`
      ]
    }
  }, [lengthStr, widthStr, thicknessStr])

  return (
    <FormCalculatorShell title="Concrete Volume Solver" subtitle="Calculate cubic yards and concrete bags needed" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Slab Length (ft)" value={lengthStr} onChange={setLengthStr} id="cnc-l" />
          <RetroInput label="Slab Width (ft)" value={widthStr} onChange={setWidthStr} id="cnc-w" />
          <RetroInput label="Slab Thickness (inches)" value={thicknessStr} onChange={setThicknessStr} id="cnc-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Cubic Yards" value={results.cubicYards.toFixed(2)} large />
              <ResultDisplay label="80lb Bags" value={results.bags80.toString()} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
