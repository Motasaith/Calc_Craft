'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AmpCalculator() {
  const [wattsStr, setWattsStr] = useState('1200')
  const [voltsStr, setVoltsStr] = useState('120')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, amps: 0, steps: [] as string[] }
    const w = parseFloat(wattsStr)
    const v = parseFloat(voltsStr)
    if (isNaN(w) || isNaN(v) || w < 0 || v <= 0) return { ...defaultObj, error: 'Please enter valid parameters.' }
    const amps = w / v
    return {
      error: null,
      amps,
      steps: [
        `Formula: Amps (I) = Power (P) / Voltage (V)`,
        `Amps = ${w} W / ${v} V = ${amps.toFixed(2)} A`
      ]
    }
  }, [wattsStr, voltsStr])

  return (
    <FormCalculatorShell title="Amps Current Solver" subtitle="Calculate electric current from power and voltage" badge="ELECTRICAL">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Power (Watts)" value={wattsStr} onChange={setWattsStr} id="amp-w" />
          <RetroInput label="Voltage (Volts)" value={voltsStr} onChange={setVoltsStr} id="amp-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Amperage (Amps)" value={results.amps.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
