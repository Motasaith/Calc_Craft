'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CircuitLoadCalculator() {
  const [wattsStr, setWattsStr] = useState('1500')
  const [voltsStr, setVoltsStr] = useState('120')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, amps: 0 }
    const w = parseFloat(wattsStr)
    const v = parseFloat(voltsStr)

    if (isNaN(w) || isNaN(v) || w < 0 || v <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const amps = w / v
    return { error: null, amps }
  }, [wattsStr, voltsStr])

  return (
    <FormCalculatorShell title="Electrical Circuit Amperage Solver" subtitle="Calculate load current draw in Amps from Watts and Volts" badge="ELECTRICAL">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Connected Load (Watts)" value={wattsStr} onChange={setWattsStr} id="cl-w" />
          <RetroInput label="Circuit Voltage (Volts)" value={voltsStr} onChange={setVoltsStr} id="cl-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Current Draw (Amps)" value={`${results.amps.toFixed(2)} Amps`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
