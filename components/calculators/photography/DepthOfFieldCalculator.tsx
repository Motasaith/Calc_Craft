'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DepthOfFieldCalculator() {
  const [focalLengthStr, setFocalLengthStr] = useState('50') // mm
  const [apertureStr, setApertureStr] = useState('2.8') // f-stop
  const [distStr, setDistStr] = useState('3') // meters
  const [cocStr, setCocStr] = useState('0.03') // mm

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, near: 0, far: 0, total: 0 }
    const f = parseFloat(focalLengthStr)
    const n = parseFloat(apertureStr)
    const d = parseFloat(distStr) * 1000 // to mm
    const coc = parseFloat(cocStr)

    if (isNaN(f) || isNaN(n) || isNaN(d) || isNaN(coc) || f <= 0 || n <= 0 || d <= 0 || coc <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const hyperfocal = (f * f) / (n * coc) + f // mm
    const near = (d * (hyperfocal - f)) / (hyperfocal + d - 2 * f)
    const far = (d * (hyperfocal - f)) / (hyperfocal - d)

    const nearM = near / 1000
    const farM = far < 0 ? Infinity : far / 1000
    const total = farM === Infinity ? Infinity : farM - nearM

    return { error: null, near: nearM, far: farM, total }
  }, [focalLengthStr, apertureStr, distStr, cocStr])

  return (
    <FormCalculatorShell title="Depth of Field Calculator" subtitle="Solve focused boundaries and blur ranges" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Focal Length (mm)" value={focalLengthStr} onChange={setFocalLengthStr} id="dof-f" />
          <RetroInput label="Aperture (f/N)" value={apertureStr} onChange={setApertureStr} id="dof-n" />
          <RetroInput label="Subject Distance (m)" value={distStr} onChange={setDistStr} id="dof-d" />
          <RetroInput label="Circle of Confusion (mm)" value={cocStr} onChange={setCocStr} id="dof-coc" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-3 gap-2">
              <ResultDisplay label="Near Limit" value={`${results.near.toFixed(2)} m`} />
              <ResultDisplay label="Far Limit" value={results.far === Infinity ? 'Infinity' : `${results.far.toFixed(2)} m`} />
              <ResultDisplay label="Total DOF" value={results.total === Infinity ? 'Infinity' : `${results.total.toFixed(2)} m`} />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
