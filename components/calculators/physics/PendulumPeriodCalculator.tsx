'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PendulumPeriodCalculator() {
  const [lenStr, setLenStr] = useState('1.0') // meters L

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, t: 0 }
    const l = parseFloat(lenStr)
    if (isNaN(l) || l <= 0) return { ...defaultObj, error: 'Please enter a valid length.' }
    // Formula: T = 2 * pi * sqrt(L/g)
    const t = 2 * Math.PI * Math.sqrt(l / 9.80665)
    return { error: null, t }
  }, [lenStr])

  return (
    <FormCalculatorShell title="Pendulum Period Solver" subtitle="Calculate periodic oscillation durations T = 2·π·√(L/g)" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Pendulum String Length (meters)" value={lenStr} onChange={setLenStr} id="pp-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Oscillation Period (T)" value={`${results.t.toFixed(4)} seconds`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
