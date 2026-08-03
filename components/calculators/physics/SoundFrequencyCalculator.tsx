'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SoundFrequencyCalculator() {
  const [speedStr, setSpeedStr] = useState('343') // velocity m/s
  const [waveStr, setWaveStr] = useState('1.5') // wavelength meters

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, freq: 0 }
    const v = parseFloat(speedStr)
    const l = parseFloat(waveStr)

    if (isNaN(v) || isNaN(l) || v <= 0 || l <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const freq = v / l
    return { error: null, freq }
  }, [speedStr, waveStr])

  return (
    <FormCalculatorShell title="Sound Frequency Solver" subtitle="Calculate sound wave frequencies from velocities and wavelengths" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Propagation Speed (m/s)" value={speedStr} onChange={setSpeedStr} id="sf-s" />
          <RetroInput label="Wavelength (meters)" value={waveStr} onChange={setWaveStr} id="sf-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Frequency (f)" value={`${results.freq.toFixed(2)} Hz`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
