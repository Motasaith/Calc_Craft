'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(x1: number, y1: number, x2: number, y2: number) {
  return `M ${x1} ${y1} L ${x2} ${y2}`
}

export default function EdgingCalculator() {
  const [perimeter, setPerimeter] = useState('120')
  const [pricePerFt, setPricePerFt] = useState('2.5')

  const p = parseFloat(perimeter) || 0
  const price = parseFloat(pricePerFt) || 0

  const feetNeeded = Math.ceil(p)
  const cost = feetNeeded * price

  const valid = p > 0 && price >= 0

  return (
    <FormCalculatorShell
      title="Edging Calculator"
      subtitle="Estimate landscape edging length and cost"
      badge="LANDSCAPING"
    >
      <div>
        <RetroInput label="Perimeter Length" value={perimeter} onChange={setPerimeter} unit="ft" min={0} />
        <RetroInput label="Price per Foot" value={pricePerFt} onChange={setPricePerFt} unit="$" min={0} step={0.1} />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Edging Needed" value={feetNeeded} unit="ft" large />
          <ResultDisplay label="Estimated Cost" value={`$${cost.toFixed(2)}`} />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <rect x="0" y="0" width="200" height="80" fill="#d8d4cc" />
        <path d={wobblyLine(20, 20, 180, 20)} stroke="#6a5a4a" strokeWidth="4" opacity={valid ? 0.85 : 0.3} />
        <path d={wobblyLine(180, 20, 180, 60)} stroke="#6a5a4a" strokeWidth="4" opacity={valid ? 0.85 : 0.3} />
        <path d={wobblyLine(180, 60, 20, 60)} stroke="#6a5a4a" strokeWidth="4" opacity={valid ? 0.85 : 0.3} />
        <path d={wobblyLine(20, 60, 20, 20)} stroke="#6a5a4a" strokeWidth="4" opacity={valid ? 0.85 : 0.3} />
      </svg>
    </FormCalculatorShell>
  )
}