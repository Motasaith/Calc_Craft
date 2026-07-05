'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`
}

export default function PlantSpacingCalculator() {
  const [bedArea, setBedArea] = useState('120')
  const [spread, setSpread] = useState('12')

  const area = parseFloat(bedArea) || 0
  const s = parseFloat(spread) || 0

  const spacingFt = s / 12
  const areaPerPlant = Math.PI * (spacingFt / 2) ** 2
  const plants = areaPerPlant > 0 ? Math.floor(area / areaPerPlant) : 0

  const valid = area > 0 && s > 0

  return (
    <FormCalculatorShell
      title="Plant Spacing Calculator"
      subtitle="Determine plant count from bed area and spread"
      badge="LANDSCAPING"
    >
      <div>
        <RetroInput label="Bed Area" value={bedArea} onChange={setBedArea} unit="sq ft" min={0} />
        <RetroInput label="Plant Spread" value={spread} onChange={setSpread} unit="in" min={0} />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Number of Plants" value={plants} unit="plants" large />
          <ResultDisplay label="Spacing" value={spacingFt.toFixed(2)} unit="ft" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <rect x="0" y="0" width="200" height="80" fill="#cde4c8" />
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 9 }).map((_, col) => (
            <path
              key={`${row}-${col}`}
              d={wobblyCircle(15 + col * 21, 15 + row * 16, 5)}
              fill="#3a7a3a"
              opacity={valid ? 0.8 : 0.3}
            />
          ))
        )}
      </svg>
    </FormCalculatorShell>
  )
}