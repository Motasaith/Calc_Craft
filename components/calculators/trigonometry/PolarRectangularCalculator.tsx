'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PolarRectangularCalculator() {
  const [rStr, setRStr] = useState('5')
  const [thetaStr, setThetaStr] = useState('30') // degrees

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, x: 0, y: 0 }
    const r = parseFloat(rStr)
    const theta = parseFloat(thetaStr)

    if (isNaN(r) || isNaN(theta) || r < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const rad = (theta * Math.PI) / 180
    const x = r * Math.cos(rad)
    const y = r * Math.sin(rad)

    return { error: null, x, y }
  }, [rStr, thetaStr])

  return (
    <FormCalculatorShell title="Polar to Rectangular Solver" subtitle="Convert polar coordinates (r, θ) to rectangular cartesian (x, y) coordinates" badge="TRIGONOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Radius (r)" value={rStr} onChange={setRStr} id="pr-r" />
          <RetroInput label="Angle (Degrees θ)" value={thetaStr} onChange={setThetaStr} id="pr-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Rectangular X coordinate" value={results.x.toFixed(4)} />
              <ResultDisplay label="Rectangular Y coordinate" value={results.y.toFixed(4)} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
