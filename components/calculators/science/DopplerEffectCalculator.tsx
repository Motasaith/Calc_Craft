'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DopplerEffectCalculator() {
  const [freqStr, setFreqStr] = useState('440') // Hz
  const [speedStr, setSpeedStr] = useState('343') // v of sound m/s
  const [vSourceStr, setVSourceStr] = useState('20') // m/s moving source

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, observed: 0 }
    const f0 = parseFloat(freqStr)
    const v = parseFloat(speedStr)
    const vs = parseFloat(vSourceStr)

    if (isNaN(f0) || isNaN(v) || isNaN(vs) || f0 <= 0 || v <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    if (vs >= v) return { ...defaultObj, error: 'Source speed cannot match or exceed wave speed.' }
    // Approaching source: f = f0 * v / (v - vs)
    const observed = f0 * (v / (v - vs))
    return { error: null, observed }
  }, [freqStr, speedStr, vSourceStr])

  return (
    <FormCalculatorShell title="Doppler Effect Observed Frequency Solver" subtitle="Calculate observed sound frequencies from moving sources" badge="SCIENCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Emitted Frequency (Hz)" value={freqStr} onChange={setFreqStr} id="de-f" />
          <RetroInput label="Sound Speed (v, m/s)" value={speedStr} onChange={setSpeedStr} id="de-v" />
          <RetroInput label="Source Speed Approaching (m/s)" value={vSourceStr} onChange={setVSourceStr} id="de-vs" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Observed Frequency" value={`${results.observed.toFixed(1)} Hz`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
