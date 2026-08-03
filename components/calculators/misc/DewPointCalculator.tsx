'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DewPointCalculator() {
  const [tempStr, setTempStr] = useState('75') // Fahrenheit
  const [humidityStr, setHumidityStr] = useState('50') // %

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, dewPoint: 0, steps: [] as string[] }
    const t = parseFloat(tempStr)
    const rh = parseFloat(humidityStr)
    if (isNaN(t) || isNaN(rh) || rh <= 0 || rh > 100) return { ...defaultObj, error: 'Please enter valid temperature and humidity (0-100%).' }
    // Convert F to C
    const tC = (t - 32) * 5 / 9
    // Magnus-Tetens formula approximation
    const a = 17.27
    const b = 237.7
    const alpha = ((a * tC) / (b + tC)) + Math.log(rh / 100)
    const dpC = (b * alpha) / (a - alpha)
    const dewPoint = (dpC * 9 / 5) + 32
    return {
      error: null,
      dewPoint,
      steps: [
        `Temperature in Celsius = ${tC.toFixed(2)}°C`,
        `Magnus-Tetens Alpha factor = ${alpha.toFixed(4)}`,
        `Dew Point = ${dewPoint.toFixed(1)}°F (${dpC.toFixed(1)}°C)`
      ]
    }
  }, [tempStr, humidityStr])

  return (
    <FormCalculatorShell title="Dew Point Solver" subtitle="Calculate dew point threshold temperatures from humidity" badge="MISCELLANEOUS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Air Temperature (°F)" value={tempStr} onChange={setTempStr} id="dp-t" />
          <RetroInput label="Relative Humidity (%)" value={humidityStr} onChange={setHumidityStr} id="dp-rh" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Dew Point Temperature" value={`${results.dewPoint.toFixed(1)}°F`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
