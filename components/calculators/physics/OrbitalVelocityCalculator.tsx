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

export default function OrbitalVelocityCalculator() {
  const [mass, setMass] = useState('5.972e24')
  const [radius, setRadius] = useState('6.7e6')
  const G = 6.674e-11

  const m = parseFloat(mass), r = parseFloat(radius)
  const valid = !isNaN(m) && !isNaN(r) && r > 0
  const v = valid ? Math.sqrt((G * m) / r) : 0
  const period = valid ? (2 * Math.PI * r) / v : 0

  return (
    <FormCalculatorShell title="Orbital Velocity" subtitle="v = √(GM/r)" badge="PHYSICS">
      <RetroInput label="Planet Mass (M)" value={mass} onChange={setMass} placeholder="5.972e24" id="ov-m" unit="kg" />
      <RetroInput label="Orbit Radius (r)" value={radius} onChange={setRadius} placeholder="6.7e6" id="ov-r" unit="m" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Orbital Velocity" value={v.toFixed(2)} unit="m/s" large />
            <ResultDisplay label="Orbital Period" value={(period / 60).toFixed(2)} unit="min" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Orbit Diagram</span>
            <svg width="140" height="120" viewBox="0 0 140 120" className="select-none">
              <defs>
                <pattern id="ovGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="120" fill="url(#ovGrid)" rx="8" />
              {/* Planet */}
              <path d={wobblyCircle(70, 55, 18)} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" />
              {/* Orbit path */}
              <path d={wobblyCircle(70, 55, 38)} fill="none" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
              {/* Satellite */}
              <circle cx="108" cy="55" r="5" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              {/* Velocity arrow */}
              <path d="M 113 55 L 130 55" stroke="#dc2626" strokeWidth="2" />
              <path d="M 130 55 L 125 51 L 125 59 Z" fill="#dc2626" />
              <text x="70" y="115" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">v = {v.toFixed(0)} m/s</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}