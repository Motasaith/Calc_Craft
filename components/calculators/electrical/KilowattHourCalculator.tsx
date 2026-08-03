'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function KilowattHourCalculator() {
  const [wattsStr, setWattsStr] = useState('500')
  const [hoursStr, setHoursStr] = useState('8')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, kwh: 0, steps: [] as string[] }
    const w = parseFloat(wattsStr)
    const h = parseFloat(hoursStr)
    if (isNaN(w) || isNaN(h) || w < 0 || h < 0) return { ...defaultObj, error: 'Please enter valid parameters.' }
    const kwh = (w * h) / 1000
    return {
      error: null,
      kwh,
      steps: [
        `Formula: kWh = (Watts × Hours) / 1000`,
        `kWh = (${w} × ${h}) / 1000 = ${kwh.toFixed(3)} kWh`
      ]
    }
  }, [wattsStr, hoursStr])

  return (
    <FormCalculatorShell title="Kilowatt-Hour kWh Solver" subtitle="Calculate electric energy usage consumption rates" badge="ELECTRICAL">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Power Draw (Watts)" value={wattsStr} onChange={setWattsStr} id="kwh-w" />
          <RetroInput label="Usage Time (Hours/day)" value={hoursStr} onChange={setHoursStr} id="kwh-h" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Daily Consumption" value={`${results.kwh.toFixed(2)} kWh`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
