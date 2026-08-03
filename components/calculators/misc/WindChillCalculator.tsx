'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WindChillCalculator() {
  const [tempStr, setTempStr] = useState('30') // Fahrenheit
  const [windStr, setWindStr] = useState('15') // mph

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, windChill: 0, steps: [] as string[] }
    const t = parseFloat(tempStr)
    const v = parseFloat(windStr)
    if (isNaN(t) || isNaN(v) || v < 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    if (t > 50 || v <= 3) return { ...defaultObj, error: 'Wind Chill is only defined for temperatures <= 50°F and wind speeds > 3 mph.' }
    // NWS Wind Chill Formula
    const windChill = 35.74 + 0.6215 * t - 35.75 * Math.pow(v, 0.16) + 0.4275 * t * Math.pow(v, 0.16)
    return {
      error: null,
      windChill,
      steps: [
        `NWS Formula: 35.74 + 0.6215T - 35.75V^0.16 + 0.4275T·V^0.16`,
        `Wind Chill Factor = ${windChill.toFixed(1)}°F`
      ]
    }
  }, [tempStr, windStr])

  return (
    <FormCalculatorShell title="Wind Chill Factor Solver" subtitle="Calculate felt cooling effects of wind speed on exposed skin" badge="MISCELLANEOUS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Air Temperature (°F <= 50°F)" value={tempStr} onChange={setTempStr} id="wc-t" />
          <RetroInput label="Wind Speed (mph > 3 mph)" value={windStr} onChange={setWindStr} id="wc-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Felt Temperature" value={`${results.windChill.toFixed(1)}°F`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
