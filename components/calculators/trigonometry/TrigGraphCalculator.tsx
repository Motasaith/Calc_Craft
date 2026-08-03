'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TrigGraphCalculator() {
  const [ampStr, setAmpStr] = useState('1') // amplitude A
  const [freqStr, setFreqStr] = useState('1') // frequency B

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, period: 0 }
    const a = parseFloat(ampStr)
    const b = parseFloat(freqStr)

    if (isNaN(a) || isNaN(b) || b === 0) {
      return { ...defaultObj, error: 'Please enter valid parameters (frequency cannot be zero).' }
    }

    const period = (2 * Math.PI) / Math.abs(b)
    return { error: null, period }
  }, [ampStr, freqStr])

  return (
    <FormCalculatorShell title="Sine Wave Period Solver" subtitle="Calculate period boundaries of sine curves y = A·sin(B·x)" badge="TRIGONOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Amplitude (A)" value={ampStr} onChange={setAmpStr} id="tg-a" />
          <RetroInput label="Frequency (B)" value={freqStr} onChange={setFreqStr} id="tg-f" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Wave Period" value={results.period.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
