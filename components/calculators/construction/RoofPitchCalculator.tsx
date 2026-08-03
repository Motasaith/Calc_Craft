'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RoofPitchCalculator() {
  const [riseStr, setRiseStr] = useState('4') // inches
  const [runStr, setRunStr] = useState('12') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, angle: 0 }
    const rise = parseFloat(riseStr)
    const run = parseFloat(runStr)

    if (isNaN(rise) || isNaN(run) || rise < 0 || run <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const angleRad = Math.atan(rise / run)
    const angle = (angleRad * 180) / Math.PI
    return { error: null, angle }
  }, [riseStr, runStr])

  return (
    <FormCalculatorShell title="Roof Pitch Angle Solver" subtitle="Determine slope angle in degrees from rise and run units" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Rise Height (inches)" value={riseStr} onChange={setRiseStr} id="rp-ri" />
          <RetroInput label="Run Length (inches)" value={runStr} onChange={setRunStr} id="rp-ru" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Roof Slope Angle" value={`dots${results.angle.toFixed(1)}°`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
