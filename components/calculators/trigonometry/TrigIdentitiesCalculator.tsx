'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TrigIdentitiesCalculator() {
  const [degStr, setDegStr] = useState('30')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, sum: 0 }
    const deg = parseFloat(degStr)
    if (isNaN(deg)) return { ...defaultObj, error: 'Please enter a valid angle.' }
    const rad = (deg * Math.PI) / 180
    // Verify Pythagorean Identity: sin²(x) + cos²(x) = 1
    const sum = Math.pow(Math.sin(rad), 2) + Math.pow(Math.cos(rad), 2)
    return { error: null, sum }
  }, [degStr])

  return (
    <FormCalculatorShell title="Pythagorean Trig Identity Solver" subtitle="Verify the basic pythagorean trigonometric identity sin²(θ) + cos²(θ)" badge="TRIGONOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Angle (Degrees °)" value={degStr} onChange={setDegStr} id="ti-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Identity Sum Result" value={results.sum.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
