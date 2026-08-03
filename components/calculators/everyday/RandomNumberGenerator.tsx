'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RandomNumberGenerator() {
  const [minStr, setMinStr] = useState('1')
  const [maxStr, setMaxStr] = useState('100')
  const [trigger, setTrigger] = useState(0)

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, value: 0 }
    const min = parseInt(minStr)
    const max = parseInt(maxStr)

    if (isNaN(min) || isNaN(max) || min >= max) {
      return { ...defaultObj, error: 'Minimum value must be less than maximum.' }
    }

    const value = Math.floor(Math.random() * (max - min + 1)) + min
    return { error: null, value }
  }, [minStr, maxStr, trigger])

  return (
    <FormCalculatorShell title="Random Number Generator" subtitle="Generate random numbers in customized boundaries" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Minimum Value" value={minStr} onChange={setMinStr} id="rng-min" />
            <RetroInput label="Maximum Value" value={maxStr} onChange={setMaxStr} id="rng-max" />
          </div>
          <button
            onClick={() => setTrigger(p => p + 1)}
            className="w-full bg-neutral-900 text-white font-mono p-3 rounded hover:bg-neutral-800 transition"
          >
            Roll Number
          </button>
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Generated Value" value={results.value.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
