'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function WaterFeatureCalculator() {
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('6')
  const [depth, setDepth] = useState('3')

  const len = parseFloat(length) || 0
  const wid = parseFloat(width) || 0
  const dep = parseFloat(depth) || 0

  const cubicFeet = len * wid * dep
  const gallons = cubicFeet * 7.48
  const liters = cubicFeet * 28.3168

  const valid = len > 0 && wid > 0 && dep > 0

  return (
    <FormCalculatorShell
      title="Water Feature Calculator"
      subtitle="Compute pond or water feature volume"
      badge="LANDSCAPING"
    >
      <div>
        <RetroInput label="Length" value={length} onChange={setLength} unit="ft" min={0} />
        <RetroInput label="Width" value={width} onChange={setWidth} unit="ft" min={0} />
        <RetroInput label="Depth" value={depth} onChange={setDepth} unit="ft" min={0} step={0.5} />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Volume" value={gallons.toFixed(1)} unit="gal" large />
          <ResultDisplay label="Volume" value={liters.toFixed(1)} unit="L" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <rect x="0" y="0" width="200" height="80" fill="#c8d8e4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <path
            key={i}
            d={wobblyBar(20 + i * 35, 25 + (i % 2) * 4, 30, 35)}
            fill="#3a6a8a"
            opacity={valid ? 0.7 : 0.3}
          />
        ))}
      </svg>
    </FormCalculatorShell>
  )
}