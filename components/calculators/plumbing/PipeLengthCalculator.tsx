'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PipeLengthCalculator() {
  const [offsetStr, setOffsetStr] = useState('12') // inches
  const [angleStr, setAngleStr] = useState('45') // degrees

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, travel: 0 }
    const offset = parseFloat(offsetStr)
    const angle = parseFloat(angleStr)

    if (isNaN(offset) || isNaN(angle) || offset <= 0 || angle <= 0 || angle >= 90) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const rad = (angle * Math.PI) / 180
    const travel = offset / Math.sin(rad)
    return { error: null, travel }
  }, [offsetStr, angleStr])

  return (
    <FormCalculatorShell title="Pipe Offset Length Solver" subtitle="Calculate travel length for diagonal pipe offset fittings" badge="PLUMBING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Offset Height (inches)" value={offsetStr} onChange={setOffsetStr} id="pl-o" />
          <RetroInput label="Fitting Angle (Degrees °)" value={angleStr} onChange={setAngleStr} id="pl-a" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Required Diagonal Length" value={`${results.travel.toFixed(2)} inches`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
