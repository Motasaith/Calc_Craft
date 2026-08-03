'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SprintSpeedCalculator() {
  const [timeStr, setTimeStr] = useState('4.5') // seconds
  const [distStr, setDistStr] = useState('40') // yards

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, mph: 0, kph: 0 }
    const t = parseFloat(timeStr)
    const d = parseFloat(distStr)

    if (isNaN(t) || isNaN(d) || t <= 0 || d <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const dMeters = d * 0.9144
    const mps = dMeters / t
    const mph = mps * 2.23694
    const kph = mps * 3.6

    return { error: null, mph, kph }
  }, [timeStr, distStr])

  return (
    <FormCalculatorShell title="Sprint Running Speed Solver" subtitle="Convert sprint distances and times into mph/kph averages" badge="SPORTS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Distance (yards)" value={distStr} onChange={setDistStr} id="ss-d" />
          <RetroInput label="Time (seconds)" value={timeStr} onChange={setTimeStr} id="ss-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Average Speed (mph)" value={`${results.mph.toFixed(2)} mph`} large />
              <ResultDisplay label="Average Speed (kph)" value={`${results.kph.toFixed(2)} kph`} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
