'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WeatherCalculator() {
  const [fStr, setFStr] = useState('68')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, c: 0, k: 0 }
    const f = parseFloat(fStr)
    if (isNaN(f)) return { ...defaultObj, error: 'Please enter a valid temperature.' }
    const c = ((f - 32) * 5) / 9
    const k = c + 273.15
    return { error: null, c, k }
  }, [fStr])

  return (
    <FormCalculatorShell title="Temperature Format Solver" subtitle="Convert Fahrenheit temperatures to Celsius and Kelvin" badge="MISCELLANEOUS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Temperature (°F)" value={fStr} onChange={setFStr} id="wc-f" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Celsius (°C)" value={`${results.c.toFixed(1)}°C`} large />
              <ResultDisplay label="Kelvin (K)" value={`${results.k.toFixed(1)} K`} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
