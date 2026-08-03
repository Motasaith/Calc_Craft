'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TireSizeCalculator() {
  const [wStr, setWStr] = useState('215') // width mm
  const [arStr, setArStr] = useState('65') // aspect ratio %
  const [dStr, setDStr] = useState('16') // wheel diameter inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, diameter: 0 }
    const w = parseFloat(wStr)
    const ar = parseFloat(arStr)
    const d = parseFloat(dStr)

    if (isNaN(w) || isNaN(ar) || isNaN(d) || w <= 0 || ar <= 0 || d <= 0) {
      return { ...defaultObj, error: 'Please enter valid tire parameters.' }
    }

    const sidewallMm = w * (ar / 100)
    const sidewallIn = sidewallMm / 25.4
    const diameter = d + 2 * sidewallIn

    return { error: null, diameter }
  }, [wStr, arStr, dStr])

  return (
    <FormCalculatorShell title="Tire Dimension Solver" subtitle="Calculate total tire outer diameter from sidewall specifications" badge="MISCELLANEOUS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Width (mm)" value={wStr} onChange={setWStr} id="ts-w" />
          <RetroInput label="Aspect Ratio (%)" value={arStr} onChange={setArStr} id="ts-ar" />
          <RetroInput label="Wheel Diameter (inches)" value={dStr} onChange={setDStr} id="ts-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Overall Diameter" value={`${results.diameter.toFixed(2)} inches`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
