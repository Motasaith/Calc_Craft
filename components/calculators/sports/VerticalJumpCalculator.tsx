'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function VerticalJumpCalculator() {
  const [jumpStr, setJumpStr] = useState('24') // inches
  const [weightStr, setWeightStr] = useState('180') // lbs

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, power: 0 }
    const jump = parseFloat(jumpStr)
    const weight = parseFloat(weightStr)

    if (isNaN(jump) || isNaN(weight) || jump <= 0 || weight <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // Sayers Formula: Peak Power (W) = 60.7 * Jump_cm + 45.3 * Weight_kg - 2055
    const jumpCm = jump * 2.54
    const weightKg = weight * 0.453592
    const power = 60.7 * jumpCm + 45.3 * weightKg - 2055

    return { error: null, power: Math.max(0, power) }
  }, [jumpStr, weightStr])

  return (
    <FormCalculatorShell title="Vertical Jump Power Solver" subtitle="Estimate athletic peak leg power in Watts using Sayers formulas" badge="SPORTS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Vertical Jump (inches)" value={jumpStr} onChange={setJumpStr} id="vj-j" />
          <RetroInput label="Body Weight (lbs)" value={weightStr} onChange={setWeightStr} id="vj-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Peak Power" value={`${Math.round(results.power)} W`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
