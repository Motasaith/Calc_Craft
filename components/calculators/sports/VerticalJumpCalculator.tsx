'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function VerticalJumpCalculator() {
  const [height, setHeight] = useState('60')
  const [weight, setWeight] = useState('75')

  const h = parseFloat(height), w = parseFloat(weight)
  const valid = !isNaN(h) && !isNaN(w) && h > 0 && w > 0
  // Power = weight(kg) × 9.81 × height(m)
  const heightM = valid ? h / 100 : 0
  const power = valid ? w * 9.81 * heightM : 0
  const rating = valid ? (h > 80 ? 'Elite' : h > 60 ? 'Excellent' : h > 40 ? 'Good' : 'Average') : ''

  return (
    <FormCalculatorShell title="Vertical Jump Power" subtitle="P = m × g × h" badge="SPORTS">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Jump Height" value={height} onChange={setHeight} placeholder="60" id="vj-h" unit="cm" />
        <RetroInput label="Body Weight" value={weight} onChange={setWeight} placeholder="75" id="vj-w" unit="kg" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Peak Power" value={power.toFixed(0)} unit="W" large />
            <ResultDisplay label="Rating" value={rating} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Jump Height</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="vjGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#vjGrid)" rx="8" />
              <path d={wobblyBar(60, 65 - Math.min(45, h / 2), 40, Math.min(45, h / 2))} fill="#f97316" fillOpacity="0.3" stroke="#ea580c" strokeWidth="2" />
              <path d="M 55 65 L 105 65" stroke="#4c5c4a" strokeWidth="2" />
              <text x="80" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ea580c" fontWeight="bold">{h}cm — {rating}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}