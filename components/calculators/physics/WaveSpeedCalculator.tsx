'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WaveSpeedCalculator() {
  const [freqStr, setFreqStr] = useState('100') // Hz
  const [wStr, setWStr] = useState('3.4') // wavelength meters

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, speed: 0 }
    const f = parseFloat(freqStr)
    const l = parseFloat(wStr)

    if (isNaN(f) || isNaN(l) || f <= 0 || l <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const speed = f * l
    return { error: null, speed }
  }, [freqStr, wStr])

  return (
    <FormCalculatorShell title="Wave Propagation Speed Solver" subtitle="Calculate wave velocity v = f·λ from frequency and wavelength" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Frequency (Hz)" value={freqStr} onChange={setFreqStr} id="ws-f" />
          <RetroInput label="Wavelength (meters)" value={wStr} onChange={setWStr} id="ws-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Wave Velocity (v)" value={`${results.speed.toFixed(2)} m/s`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
