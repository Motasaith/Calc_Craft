'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PaverCalculator() {
  const [patioArea, setPatioArea] = useState('200')
  const [paverWidth, setPaverWidth] = useState('12')
  const [paverLength, setPaverLength] = useState('12')

  const area = parseFloat(patioArea) || 0
  const pw = parseFloat(paverWidth) || 0
  const pl = parseFloat(paverLength) || 0

  const paverArea = (pw * pl) / 144
  const basePavers = paverArea > 0 ? Math.ceil(area / paverArea) : 0
  const withWaste = Math.ceil(basePavers * 1.1)
  const wasteFactor = withWaste - basePavers

  const valid = area > 0 && paverArea > 0

  return (
    <FormCalculatorShell
      title="Paver Calculator"
      subtitle="Count pavers needed for a patio or path"
      badge="LANDSCAPING"
    >
      <div>
        <RetroInput label="Patio Area" value={patioArea} onChange={setPatioArea} unit="sq ft" min={0} />
        <RetroInput label="Paver Width" value={paverWidth} onChange={setPaverWidth} unit="in" min={0} />
        <RetroInput label="Paver Length" value={paverLength} onChange={setPaverLength} unit="in" min={0} />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Pavers Needed" value={withWaste} unit="pavers" large />
          <ResultDisplay label="Waste Factor (10%)" value={wasteFactor} unit="extra" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <rect x="0" y="0" width="200" height="80" fill="#c8c4bc" />
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => (
            <path
              key={`${row}-${col}`}
              d={wobblyBar(10 + col * 23, 10 + row * 12, 21, 11)}
              fill={(row + col) % 2 === 0 ? '#9a8a7a' : '#8a7a6a'}
              opacity={valid ? 0.85 : 0.3}
            />
          ))
        )}
      </svg>
    </FormCalculatorShell>
  )
}