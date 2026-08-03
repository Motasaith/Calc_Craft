'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ReferenceAngleCalculator() {
  const [valStr, setValStr] = useState('150')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      refAngle: 0,
      quadrant: '',
      sinSign: '',
      cosSign: '',
      steps: [] as string[],
      deg: 0
    }

    const v = parseFloat(valStr)
    if (isNaN(v)) {
      return { ...defaultObj, error: 'Please enter a valid number.' }
    }

    // Normalize angle to 0 - 360
    const deg = (v % 360 + 360) % 360
    let refAngle = 0
    let quadrant = ''
    let sinSign = '+'
    let cosSign = '+'

    if (deg >= 0 && deg < 90) {
      refAngle = deg
      quadrant = 'Quadrant I'
    } else if (deg >= 90 && deg < 180) {
      refAngle = 180 - deg
      quadrant = 'Quadrant II'
      cosSign = '-'
    } else if (deg >= 180 && deg < 270) {
      refAngle = deg - 180
      quadrant = 'Quadrant III'
      sinSign = '-'
      cosSign = '-'
    } else {
      refAngle = 360 - deg
      quadrant = 'Quadrant IV'
      sinSign = '-'
    }

    const steps = [
      `Normalized Angle = ${deg}°`,
      `Quadrant position = ${quadrant}`,
      `Reference Angle = ${refAngle}°`,
      `Sine sign: ${sinSign} | Cosine sign: ${cosSign}`
    ]

    return {
      error: null,
      refAngle,
      quadrant,
      sinSign,
      cosSign,
      steps,
      deg
    }
  }, [valStr])

  return (
    <FormCalculatorShell title="Reference Angle Calculator" subtitle="Find the acute angle formed with the x-axis" badge="TRIGONOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Angle (degrees)" value={valStr} onChange={setValStr} id="ref-deg" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Reference Angle" value={`${results.refAngle.toFixed(2)}°`} large />
                <ResultDisplay label="Quadrant" value={results.quadrant} large />
              </div>

              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Mathematical Details</p>
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
