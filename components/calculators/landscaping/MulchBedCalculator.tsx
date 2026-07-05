'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function MulchBedCalculator() {
  const [bedArea, setBedArea] = useState('300')
  const [depth, setDepth] = useState('3')

  const a = parseFloat(bedArea) || 0
  const d = parseFloat(depth) || 0

  const cubicFeet = (a * d) / 12
  const bags = Math.ceil(cubicFeet / 2)

  const valid = a > 0 && d > 0

  return (
    <FormCalculatorShell
      title="Mulch Bed Calculator"
      subtitle="Figure out mulch volume and bag count"
      badge="LANDSCAPING"
    >
      <div>
        <RetroInput label="Bed Area" value={bedArea} onChange={setBedArea} unit="sq ft" min={0} />
        <RetroInput label="Desired Depth" value={depth} onChange={setDepth} unit="in" min={0} />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Cubic Feet" value={cubicFeet.toFixed(1)} unit="ft³" large />
          <ResultDisplay label="Bags (2 ft³)" value={bags} unit="bags" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <rect x="0" y="0" width="200" height="80" fill="#d8c8a8" />
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d={wobblyBar(8 + i * 23, 15 + (i % 2) * 5, 20, 55)}
            fill="#5a3a2a"
            opacity={valid ? 0.8 : 0.3}
          />
        ))}
      </svg>
    </FormCalculatorShell>
  )
}