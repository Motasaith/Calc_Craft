'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function LawOfCosinesCalculator() {
  const [sideAStr, setSideAStr] = useState('5')
  const [sideBStr, setSideBStr] = useState('7')
  const [angCStr, setAngCStr] = useState('60') // degrees

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, sideC: 0 }
    const a = parseFloat(sideAStr)
    const b = parseFloat(sideBStr)
    const gamma = parseFloat(angCStr)

    if (isNaN(a) || isNaN(b) || isNaN(gamma) || a <= 0 || b <= 0 || gamma <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const gammaRad = (gamma * Math.PI) / 180
    // Law of Cosines: c² = a² + b² - 2ab cos(C)
    const sideC = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(gammaRad))

    return { error: null, sideC }
  }, [sideAStr, sideBStr, angCStr])

  return (
    <FormCalculatorShell title="Law of Cosines Triangle Solver" subtitle="Calculate unknown side c from adjacent sides and angle C" badge="TRIGONOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Side a Length" value={sideAStr} onChange={setSideAStr} id="loc-a" />
          <RetroInput label="Side b Length" value={sideBStr} onChange={setSideBStr} id="loc-b" />
          <RetroInput label="Angle C (Degrees °)" value={angCStr} onChange={setAngCStr} id="loc-c" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Side c Length" value={results.sideC.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
