'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HyperfocalDistanceCalculator() {
  const [focalLengthStr, setFocalLengthStr] = useState('50') // mm
  const [apertureStr, setApertureStr] = useState('8')
  const [cocStr, setCocStr] = useState('0.03') // mm

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, hyperfocal: 0 }
    const f = parseFloat(focalLengthStr)
    const n = parseFloat(apertureStr)
    const coc = parseFloat(cocStr)
    if (isNaN(f) || isNaN(n) || isNaN(coc) || f <= 0 || n <= 0 || coc <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }
    const h = (f * f) / (n * coc) + f // mm
    return { error: null, hyperfocal: h / 1000 } // meters
  }, [focalLengthStr, apertureStr, cocStr])

  return (
    <FormCalculatorShell title="Hyperfocal Distance Calculator" subtitle="Solve focal limit boundary for infinite focus depth" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Focal Length (mm)" value={focalLengthStr} onChange={setFocalLengthStr} id="hyp-f" />
          <RetroInput label="Aperture (f/N)" value={apertureStr} onChange={setApertureStr} id="hyp-n" />
          <RetroInput label="Circle of Confusion (mm)" value={cocStr} onChange={setCocStr} id="hyp-coc" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Hyperfocal Distance (m)" value={results.hyperfocal.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
