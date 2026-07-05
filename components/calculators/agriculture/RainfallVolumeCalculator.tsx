'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function RainfallVolumeCalculator() {
  const [area, setArea] = useState('1000')
  const [rainfall, setRainfall] = useState('25')

  const a = parseFloat(area), r = parseFloat(rainfall)
  const valid = !isNaN(a) && !isNaN(r) && a > 0 && r >= 0
  const volume = valid ? (a * r) / 1000 : 0 // m³

  return (
    <FormCalculatorShell title="Rainfall Volume" subtitle="V = Area × Rainfall" badge="AGRICULTURE">
      <RetroInput label="Catchment Area" value={area} onChange={setArea} placeholder="1000" id="rv-a" unit="m²" />
      <RetroInput label="Rainfall" value={rainfall} onChange={setRainfall} placeholder="25" id="rv-r" unit="mm" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Water Volume" value={volume.toFixed(2)} unit="m³" large />
            <ResultDisplay label="Liters" value={(volume * 1000).toFixed(0)} unit="L" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Rain Collection</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="rvGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#rvGrid)" rx="8" />
              {/* Rain drops */}
              {[30, 50, 70, 90, 110, 130].map((x, i) => (
                <path key={i} d={`M ${x} 10 L ${x - 2} 20 M ${x} 10 L ${x + 2} 20`} stroke="#60a5fa" strokeWidth="1.5" />
              ))}
              {/* Collection tank */}
              <path d={wobblyBar(50, 30, 60, 35)} fill="#60a5fa" fillOpacity="0.2" stroke="#2563eb" strokeWidth="2" />
              <path d={wobblyBar(50, 30 + 35 - Math.min(35, r * 1.5), 60, Math.min(35, r * 1.5))} fill="#60a5fa" fillOpacity="0.4" stroke="#2563eb" strokeWidth="1.5" />
              <text x="80" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb" fontWeight="bold">{volume.toFixed(1)} m³</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}