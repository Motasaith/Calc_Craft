'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SpeedOfSoundCalculator() {
  const [tempStr, setTempStr] = useState('20') // Celsius

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, speed: 0 }
    const t = parseFloat(tempStr)
    if (isNaN(t)) return { ...defaultObj, error: 'Please enter a valid temperature.' }
    // Formula: v = 331.3 * sqrt(1 + t/273.15)
    const speed = 331.3 * Math.sqrt(1 + t / 273.15)
    return { error: null, speed }
  }, [tempStr])

  return (
    <FormCalculatorShell title="Speed of Sound Solver" subtitle="Calculate acoustic propagation speeds in air based on temperatures" badge="SCIENCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Air Temperature (°C)" value={tempStr} onChange={setTempStr} id="ss-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Sound Speed (v)" value={`${results.speed.toFixed(1)} m/s`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
