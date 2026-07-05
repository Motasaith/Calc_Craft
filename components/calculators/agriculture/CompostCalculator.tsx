'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CompostCalculator() {
  const [volume, setVolume] = useState('2')
  const [depth, setDepth] = useState('5')

  const v = parseFloat(volume), d = parseFloat(depth)
  const valid = !isNaN(v) && !isNaN(d) && v > 0 && d > 0
  const area = valid ? (v / (d / 100)) : 0 // m²

  return (
    <FormCalculatorShell title="Compost Calculator" subtitle="Area = Volume / Depth" badge="AGRICULTURE">
      <RetroInput label="Compost Volume" value={volume} onChange={setVolume} placeholder="2" id="cp-v" unit="m³" />
      <RetroInput label="Application Depth" value={depth} onChange={setDepth} placeholder="5" id="cp-d" unit="cm" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Coverage Area" value={area.toFixed(2)} unit="m²" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Compost Layer</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="cpGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#cpGrid)" rx="8" />
              {/* Soil base */}
              <path d={wobblyBar(15, 50, 130, 20)} fill="#a16207" fillOpacity="0.2" stroke="#a16207" strokeWidth="1.5" />
              {/* Compost layer */}
              <path d={wobblyBar(15, 50 - Math.min(20, d * 2), 130, Math.min(20, d * 2))} fill="#65a30d" fillOpacity="0.3" stroke="#65a30d" strokeWidth="2" />
              <text x="80" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#65a30d" fontWeight="bold">{area.toFixed(1)} m² coverage</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}