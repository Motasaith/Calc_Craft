'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PipeSizingCalculator() {
  const [flowStr, setFlowStr] = useState('10') // GPM
  const [velocityStr, setVelocityStr] = useState('5') // fps (feet per second)

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, diameter: 0 }
    const q = parseFloat(flowStr)
    const v = parseFloat(velocityStr)

    if (isNaN(q) || isNaN(v) || q <= 0 || v <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // d = sqrt(0.4085 * Q / v)
    const diameter = Math.sqrt((0.4085 * q) / v)
    return { error: null, diameter }
  }, [flowStr, velocityStr])

  return (
    <FormCalculatorShell title="Plumbing Pipe Size Solver" subtitle="Calculate required inner pipe diameter based on velocity limits" badge="PLUMBING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Design Flow Rate (GPM)" value={flowStr} onChange={setFlowStr} id="ps-q" />
          <RetroInput label="Velocity Limit (feet/sec)" value={velocityStr} onChange={setVelocityStr} id="ps-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Required Inner Diameter" value={`${results.diameter.toFixed(2)} inches`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
