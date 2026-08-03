'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PolygonAreaCalculator() {
  const [sidesStr, setSidesStr] = useState('5') // number of sides
  const [lengthStr, setLengthStr] = useState('6') // length of a side

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      area: 0,
      perimeter: 0,
      interiorAngle: 0,
      steps: [] as string[]
    }

    const n = parseInt(sidesStr)
    const s = parseFloat(lengthStr)

    if (isNaN(n) || isNaN(s) || n < 3 || s <= 0) {
      return { ...defaultObj, error: 'Please enter at least 3 sides and a positive length.' }
    }

    // Area of regular polygon = (n * s^2) / (4 * tan(pi / n))
    const area = (n * s * s) / (4 * Math.tan(Math.PI / n))
    const perimeter = n * s
    const interiorAngle = ((n - 2) * 180) / n

    const steps = [
      `Perimeter = n × s = ${n} × ${s} = ${perimeter}`,
      `Interior Angle = ((n-2) × 180) / n = ${interiorAngle.toFixed(1)}°`,
      `Area = (n × s²) / (4 × tan(π/n)) = (${n} × ${s * s}) / (4 × tan(180°/${n})) = ${area.toFixed(4)}`
    ]

    return {
      error: null,
      area,
      perimeter,
      interiorAngle,
      steps
    }
  }, [sidesStr, lengthStr])

  return (
    <FormCalculatorShell title="Regular Polygon Area Calculator" subtitle="Solve area, perimeter, and angles of any regular polygon" badge="GEOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Number of Sides (n)" value={sidesStr} onChange={setSidesStr} id="poly-n" />
          <RetroInput label="Side Length (s)" value={lengthStr} onChange={setLengthStr} id="poly-s" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Area" value={results.area.toFixed(4)} />
                <ResultDisplay label="Perimeter" value={results.perimeter.toFixed(4)} />
                <ResultDisplay label="Interior Angle" value={`${results.interiorAngle.toFixed(1)}°`} />
              </div>

              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Formula Steps</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results.error}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
