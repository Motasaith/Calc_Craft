'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function SoilAreaCalculator() {
  const [length, setLength] = useState('100')
  const [width, setWidth] = useState('50')

  const l = parseFloat(length), w = parseFloat(width)
  const valid = !isNaN(l) && !isNaN(w) && l > 0 && w > 0
  const areaM2 = valid ? l * w : 0
  const areaHa = valid ? areaM2 / 10000 : 0
  const areaAcre = valid ? areaM2 / 4047 : 0

  return (
    <FormCalculatorShell title="Soil Area Calculator" subtitle="A = L × W" badge="AGRICULTURE">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Length" value={length} onChange={setLength} placeholder="100" id="sa-l" unit="m" />
        <RetroInput label="Width" value={width} onChange={setWidth} placeholder="50" id="sa-w" unit="m" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ResultDisplay label="m²" value={areaM2.toFixed(0)} large />
            <ResultDisplay label="hectares" value={areaHa.toFixed(4)} large />
            <ResultDisplay label="acres" value={areaAcre.toFixed(4)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Field Plot</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="saGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#saGrid)" rx="8" />
              <path d={wobblyRect(20, 15, Math.min(120, (l / Math.max(l, w)) * 120), Math.min(60, (w / Math.max(l, w)) * 60))} fill="#a16207" fillOpacity="0.15" stroke="#a16207" strokeWidth="2" />
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#a16207" fontWeight="bold">{areaM2.toFixed(0)} m²</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}