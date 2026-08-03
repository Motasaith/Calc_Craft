'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HeatIndexCalculator() {
  const [tempStr, setTempStr] = useState('85') // F
  const [humidityStr, setHumidityStr] = useState('70') // %

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, hi: 0 }
    const t = parseFloat(tempStr)
    const rh = parseFloat(humidityStr)

    if (isNaN(t) || isNaN(rh) || rh < 0 || rh > 100) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // NOAA simple heat index formula
    const hi = 0.5 * (t + 61.0 + ((t - 68.0) * 1.2) + (rh * 0.094))
    return { error: null, hi }
  }, [tempStr, humidityStr])

  return (
    <FormCalculatorShell title="Heat Index Solver" subtitle="Calculate felt apparent air temperatures based on humidity" badge="MISCELLANEOUS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Air Temperature (°F)" value={tempStr} onChange={setTempStr} id="hi-t" />
          <RetroInput label="Relative Humidity (%)" value={humidityStr} onChange={setHumidityStr} id="hi-rh" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Felt Temperature (Heat Index)" value={`${results.hi.toFixed(1)}°F`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
