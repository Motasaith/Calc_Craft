'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function IrrigationCalculator() {
  const [area, setArea] = useState('1000')
  const [depth, setDepth] = useState('25')

  const a = parseFloat(area), d = parseFloat(depth)
  const valid = !isNaN(a) && !isNaN(d) && a > 0 && d >= 0
  const volume = valid ? (a * d) / 1000 : 0 // cubic meters (area m² × mm → /1000)

  return (
    <FormCalculatorShell title="Irrigation Calculator" subtitle="V = Area × Depth" badge="AGRICULTURE">
      <RetroInput label="Field Area" value={area} onChange={setArea} placeholder="1000" id="ir-a" unit="m²" />
      <RetroInput label="Water Depth" value={depth} onChange={setDepth} placeholder="25" id="ir-d" unit="mm" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Water Volume" value={volume.toFixed(2)} unit="m³" large />
            <ResultDisplay label="Liters" value={(volume * 1000).toFixed(0)} unit="L" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Water Coverage</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="irGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#irGrid)" rx="8" />
              <path d={wobblyRect(20, 15, 120, 60)} fill="#84cc16" fillOpacity="0.1" stroke="#65a30d" strokeWidth="2" />
              <path d={wobblyRect(20, 15 + 60 - Math.min(40, d), 120, Math.min(40, d))} fill="#60a5fa" fillOpacity="0.3" stroke="#2563eb" strokeWidth="1.5" />
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb" fontWeight="bold">{volume.toFixed(1)} m³ water</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}