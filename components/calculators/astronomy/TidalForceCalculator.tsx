'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  const steps = 28
  let path = ''
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2
    const jitter = (Math.sin(i * 3.1) - 0.5) * 1.0
    const x = cx + (r + jitter) * Math.cos(theta)
    const y = cy + (r + jitter) * Math.sin(theta)
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return path + ' Z'
}

export default function TidalForceCalculator() {
  const [mass, setMass] = useState('5.972e24')
  const [radius, setRadius] = useState('6.371e6')
  const [distance, setDistance] = useState('3.844e8')
  const G = 6.674e-11

  const m = parseFloat(mass), r = parseFloat(radius), d = parseFloat(distance)
  const valid = !isNaN(m) && !isNaN(r) && !isNaN(d) && d > 0 && r > 0
  const ft = valid ? (2 * G * m * r) / (d * d * d) : 0

  return (
    <FormCalculatorShell title="Tidal Force" subtitle="Ft = 2GMR / d³" badge="ASTRONOMY">
      <RetroInput label="Mass (M)" value={mass} onChange={setMass} placeholder="5.972e24" id="tf-m" unit="kg" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Body Radius (R)" value={radius} onChange={setRadius} placeholder="6.371e6" id="tf-r" unit="m" />
        <RetroInput label="Distance (d)" value={distance} onChange={setDistance} placeholder="3.844e8" id="tf-d" unit="m" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Tidal Force" value={ft.toExponential(4)} unit="N" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Tidal Effect</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="tfGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#tfGrid)" rx="8" />
              {/* Body with tidal bulge */}
              <ellipse cx="40" cy="40" rx="18" ry="14" fill="#60a5fa" fillOpacity="0.3" stroke="#2563eb" strokeWidth="2" />
              {/* Moon/other body */}
              <path d={wobblyCircle(140, 40, 10)} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" />
              {/* Tidal arrows */}
              <path d="M 60 40 L 75 40" stroke="#dc2626" strokeWidth="2" />
              <path d="M 75 40 L 71 36 L 71 44 Z" fill="#dc2626" />
              <path d="M 20 40 L 5 40" stroke="#dc2626" strokeWidth="2" />
              <path d="M 5 40 L 9 36 L 9 44 Z" fill="#dc2626" />
              <text x="90" y="72" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">Ft = {ft.toExponential(2)} N</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}