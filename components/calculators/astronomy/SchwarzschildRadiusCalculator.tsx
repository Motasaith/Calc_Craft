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

export default function SchwarzschildRadiusCalculator() {
  const [mass, setMass] = useState('1.989e30')
  const G = 6.674e-11
  const c = 3e8

  const m = parseFloat(mass)
  const valid = !isNaN(m) && m > 0
  const rs = valid ? (2 * G * m) / (c * c) : 0

  return (
    <FormCalculatorShell title="Schwarzschild Radius" subtitle="rs = 2GM/c²" badge="ASTRONOMY">
      <RetroInput label="Mass (M)" value={mass} onChange={setMass} placeholder="1.989e30" id="sr-m" unit="kg" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Event Horizon Radius" value={rs.toExponential(4)} unit="m" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Black Hole</span>
            <svg width="140" height="120" viewBox="0 0 140 120" className="select-none">
              <defs>
                <pattern id="srGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="120" fill="url(#srGrid)" rx="8" />
              {/* Accretion disk */}
              <ellipse cx="70" cy="55" rx="45" ry="12" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 2" />
              <ellipse cx="70" cy="55" rx="35" ry="9" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
              {/* Event horizon */}
              <path d={wobblyCircle(70, 55, 18)} fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2.5" />
              <text x="70" y="115" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">rs = {rs.toExponential(2)} m</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}