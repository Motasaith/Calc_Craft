'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function GreenhouseAreaCalculator() {
  const [length, setLength] = useState('20')
  const [width, setWidth] = useState('10')
  const [height, setHeight] = useState('3')

  const l = parseFloat(length), w = parseFloat(width), h = parseFloat(height)
  const valid = !isNaN(l) && !isNaN(w) && !isNaN(h) && l > 0 && w > 0 && h > 0
  const floorArea = valid ? l * w : 0
  const volume = valid ? l * w * h : 0
  const surfaceArea = valid ? 2 * (l * w + l * h + w * h) : 0

  return (
    <FormCalculatorShell title="Greenhouse Area" subtitle="Volume = L × W × H" badge="AGRICULTURE">
      <div className="grid grid-cols-3 gap-2">
        <RetroInput label="Length" value={length} onChange={setLength} placeholder="20" id="gh-l" unit="m" />
        <RetroInput label="Width" value={width} onChange={setWidth} placeholder="10" id="gh-w" unit="m" />
        <RetroInput label="Height" value={height} onChange={setHeight} placeholder="3" id="gh-h" unit="m" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ResultDisplay label="Floor Area" value={floorArea.toFixed(0)} unit="m²" />
            <ResultDisplay label="Volume" value={volume.toFixed(0)} unit="m³" />
            <ResultDisplay label="Surface" value={surfaceArea.toFixed(0)} unit="m²" />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Greenhouse</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="ghGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#ghGrid)" rx="8" />
              {/* Greenhouse shape */}
              <path d={wobblyRect(30, 30, 100, 35)} fill="#84cc16" fillOpacity="0.15" stroke="#65a30d" strokeWidth="2" />
              <path d="M 30 30 L 80 10 L 130 30" fill="#84cc16" fillOpacity="0.1" stroke="#65a30d" strokeWidth="2" />
              <text x="80" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#65a30d" fontWeight="bold">{floorArea.toFixed(0)} m² floor</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}