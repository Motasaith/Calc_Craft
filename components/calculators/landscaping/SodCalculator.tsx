'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function SodCalculator() {
  const [length, setLength] = useState('100')
  const [width, setWidth] = useState('50')
  const [pricePerSod, setPricePerSod] = useState('0.45')

  const len = parseFloat(length) || 0
  const wid = parseFloat(width) || 0
  const price = parseFloat(pricePerSod) || 0

  const area = len * wid
  const sodSquares = Math.ceil(area / 9)
  const cost = sodSquares * price

  const valid = area > 0 && price >= 0

  return (
    <FormCalculatorShell
      title="Sod Calculator"
      subtitle="Estimate sod squares and cost for your lawn"
      badge="LANDSCAPING"
    >
      <div>
        <RetroInput label="Lawn Length" value={length} onChange={setLength} unit="ft" min={0} />
        <RetroInput label="Lawn Width" value={width} onChange={setWidth} unit="ft" min={0} />
        <RetroInput label="Price per Sod Square" value={pricePerSod} onChange={setPricePerSod} unit="$" min={0} step={0.05} />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Lawn Area" value={area.toFixed(0)} unit="sq ft" />
          <ResultDisplay label="Sod Squares Needed" value={sodSquares} unit="pieces" large />
          <ResultDisplay label="Estimated Cost" value={`$${cost.toFixed(2)}`} />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <rect x="0" y="0" width="200" height="80" fill="#cde4c8" />
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d={wobblyBar(10 + i * 23, 10 + (i % 2) * 4, 20, 60)}
            fill={i % 2 === 0 ? '#5a8a4a' : '#4a7a3a'}
            opacity={valid ? 0.85 : 0.3}
          />
        ))}
      </svg>
    </FormCalculatorShell>
  )
}