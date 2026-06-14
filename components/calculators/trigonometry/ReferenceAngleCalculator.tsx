'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function ReferenceAngleCalculator() {
  const [angle, setAngle] = useState('210')
  const [result, setResult] = useState<{reference:number,quadrant:number}|null>(null)

  const calculate = () => {
    const a = parseFloat(angle)
    if (isNaN(a)) { setResult(null); return }
    const normalized = ((a % 360) + 360) % 360
    let ref = 0, quad = 0
    if (normalized <= 90) { ref = normalized; quad = 1 }
    else if (normalized <= 180) { ref = 180 - normalized; quad = 2 }
    else if (normalized <= 270) { ref = normalized - 180; quad = 3 }
    else { ref = 360 - normalized; quad = 4 }
    setResult({ reference: ref, quadrant: quad })
  }

  return (
    <FormCalculatorShell title="Reference Angle" badge="TRIGONOMETRY">
      <RetroInput label="Angle (°)" value={angle} onChange={setAngle} placeholder="210" id="ref-a" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Reference Angle" value={`${result.reference}°`} large />
          <ResultDisplay label="Quadrant" value={result.quadrant} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
