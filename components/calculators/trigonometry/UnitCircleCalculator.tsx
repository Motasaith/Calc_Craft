'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function UnitCircleCalculator() {
  const [degStr, setDegStr] = useState('45')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, sin: 0, cos: 0, tan: 0 }
    const deg = parseFloat(degStr)
    if (isNaN(deg)) return { ...defaultObj, error: 'Please enter a valid angle.' }
    const rad = (deg * Math.PI) / 180
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)
    const tan = Math.abs(cos) > 1e-9 ? Math.tan(rad) : Infinity
    return { error: null, sin, cos, tan }
  }, [degStr])

  return (
    <FormCalculatorShell title="Unit Circle Angle Values Solver" subtitle="Resolve sine, cosine, and tangent values for unit circle degrees" badge="TRIGONOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Angle (Degrees °)" value={degStr} onChange={setDegStr} id="uc-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-3 gap-2">
              <ResultDisplay label="sin(θ)" value={results.sin.toFixed(4)} />
              <ResultDisplay label="cos(θ)" value={results.cos.toFixed(4)} />
              <ResultDisplay label="tan(θ)" value={results.tan === Infinity ? 'Undefined' : results.tan.toFixed(4)} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
