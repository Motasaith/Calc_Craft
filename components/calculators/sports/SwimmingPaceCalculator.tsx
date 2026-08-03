'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SwimmingPaceCalculator() {
  const [distStr, setDistStr] = useState('1000') // meters
  const [minStr, setMinStr] = useState('20') // minutes
  const [secStr, setSecStr] = useState('0') // seconds

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, paceMin: 0, paceSec: 0 }
    const dist = parseFloat(distStr)
    const mins = parseFloat(minStr)
    const secs = parseFloat(secStr)

    if (isNaN(dist) || isNaN(mins) || isNaN(secs) || dist <= 0 || mins < 0 || secs < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const totalSeconds = mins * 60 + secs
    const secondsPer100m = (totalSeconds / dist) * 100
    const paceMin = Math.floor(secondsPer100m / 60)
    const paceSec = Math.round(secondsPer100m % 60)

    return { error: null, paceMin, paceSec }
  }, [distStr, minStr, secStr])

  return (
    <FormCalculatorShell title="Swimming Pace Solver" subtitle="Calculate swimming pace averages per 100 meters" badge="SPORTS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Distance (meters)" value={distStr} onChange={setDistStr} id="sp-d" />
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Minutes" value={minStr} onChange={setMinStr} id="sp-m" />
            <RetroInput label="Seconds" value={secStr} onChange={setSecStr} id="sp-s" />
          </div>
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Pace per 100m" value={`${results.paceMin}:${results.paceSec < 10 ? '0' : ''}${results.paceSec}/100m`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
