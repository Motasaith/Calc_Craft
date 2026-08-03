'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BatteryCapacityCalculator() {
  const [ampsStr, setAmpsStr] = useState('2')
  const [hoursStr, setHoursStr] = useState('10')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ah: 0, steps: [] as string[] }
    const a = parseFloat(ampsStr)
    const h = parseFloat(hoursStr)
    if (isNaN(a) || isNaN(h) || a <= 0 || h <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const ah = a * h
    return {
      error: null,
      ah,
      steps: [
        `Formula: Capacity (Ah) = Current (A) × Time (h)`,
        `Capacity = ${a} A × ${h} h = dots = ${ah.toFixed(1)} Ah`
      ]
    }
  }, [ampsStr, hoursStr])

  return (
    <FormCalculatorShell title="Battery Capacity Solver" subtitle="Calculate battery Amp-Hours or runtimes" badge="ELECTRICAL">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Load Current (Amps)" value={ampsStr} onChange={setAmpsStr} id="bat-a" />
          <RetroInput label="Runtime (Hours)" value={hoursStr} onChange={setHoursStr} id="bat-h" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Battery Capacity" value={`${results.ah.toFixed(1)} Ah`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
