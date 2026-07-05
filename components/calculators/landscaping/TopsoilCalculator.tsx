'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function TopsoilCalculator() {
  const [area, setArea] = useState('500')
  const [depth, setDepth] = useState('4')

  const a = parseFloat(area) || 0
  const d = parseFloat(depth) || 0

  const cubicFeet = (a * d) / 12
  const cubicYards = cubicFeet / 27
  const cubicMeters = cubicFeet * 0.0283168
  const bags = Math.ceil(cubicFeet / 1.5)

  const valid = a > 0 && d > 0

  return (
    <FormCalculatorShell
      title="Topsoil Calculator"
      subtitle="Compute topsoil volume for beds and lawns"
      badge="LANDSCAPING"
    >
      <div>
        <RetroInput label="Area" value={area} onChange={setArea} unit="sq ft" min={0} />
        <RetroInput label="Depth" value={depth} onChange={setDepth} unit="in" min={0} />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Cubic Yards" value={cubicYards.toFixed(2)} unit="yd³" large />
          <ResultDisplay label="Cubic Meters" value={cubicMeters.toFixed(2)} unit="m³" />
          <ResultDisplay label="Bags (1.5 ft³)" value={bags} unit="bags" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <rect x="0" y="0" width="200" height="80" fill="#e8dcc4" />
        {Array.from({ length: 6 }).map((_, i) => (
          <path
            key={i}
            d={wobblyBar(10 + i * 31, 20 + (i % 2) * 3, 28, 50)}
            fill="#7a5a3a"
            opacity={valid ? 0.8 : 0.3}
          />
        ))}
      </svg>
    </FormCalculatorShell>
  )
}