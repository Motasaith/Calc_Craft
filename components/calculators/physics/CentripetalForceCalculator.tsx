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

export default function CentripetalForceCalculator() {
  const [mass, setMass] = useState('2')
  const [vel, setVel] = useState('10')
  const [radius, setRadius] = useState('5')

  const m = parseFloat(mass), v = parseFloat(vel), r = parseFloat(radius)
  const valid = !isNaN(m) && !isNaN(v) && !isNaN(r) && m >= 0 && r > 0
  const fc = valid ? (m * v * v) / r : 0
  const ac = valid ? (v * v) / r : 0

  return (
    <FormCalculatorShell title="Centripetal Force" subtitle="Fc = m × v² / r" badge="PHYSICS">
      <RetroInput label="Mass (m)" value={mass} onChange={setMass} placeholder="e.g. 2" id="cf-m" unit="kg" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Velocity (v)" value={vel} onChange={setVel} placeholder="10" id="cf-v" unit="m/s" />
        <RetroInput label="Radius (r)" value={radius} onChange={setRadius} placeholder="5" id="cf-r" unit="m" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Centripetal Force" value={fc.toFixed(2)} unit="N" large />
            <ResultDisplay label="Acceleration" value={ac.toFixed(2)} unit="m/s²" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Circular Motion</span>
            <svg width="140" height="120" viewBox="0 0 140 120" className="select-none">
              <defs>
                <pattern id="cfGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="120" fill="url(#cfGrid)" rx="8" />
              {/* Circular path */}
              <path d={wobblyCircle(70, 55, 35)} fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Center */}
              <circle cx="70" cy="55" r="3" fill="#4c5c4a" />
              {/* Object on circle */}
              <circle cx="105" cy="55" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              {/* Force vector pointing inward */}
              <path d="M 98 55 L 78 55" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 78 55 L 84 50 L 84 60 Z" fill="#dc2626" />
              <text x="70" y="110" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">Fc = {fc.toFixed(1)} N</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}