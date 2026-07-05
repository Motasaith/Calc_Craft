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

export default function EscapeVelocityCalculator() {
  const [mass, setMass] = useState('5.972e24')
  const [radius, setRadius] = useState('6.371e6')
  const G = 6.674e-11

  const m = parseFloat(mass), r = parseFloat(radius)
  const valid = !isNaN(m) && !isNaN(r) && r > 0
  const v = valid ? Math.sqrt((2 * G * m) / r) : 0

  return (
    <FormCalculatorShell title="Escape Velocity" subtitle="v = √(2GM/r)" badge="ASTRONOMY">
      <RetroInput label="Body Mass (M)" value={mass} onChange={setMass} placeholder="5.972e24" id="ev-m" unit="kg" />
      <RetroInput label="Body Radius (r)" value={radius} onChange={setRadius} placeholder="6.371e6" id="ev-r" unit="m" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Escape Velocity" value={v.toFixed(2)} unit="m/s" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Escape Trajectory</span>
            <svg width="160" height="100" viewBox="0 0 160 100" className="select-none">
              <defs>
                <pattern id="evGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="100" fill="url(#evGrid)" rx="8" />
              {/* Planet */}
              <path d={wobblyCircle(50, 60, 25)} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" />
              {/* Escape trajectory (curved path) */}
              <path d="M 50 35 Q 90 15 150 20" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
              {/* Rocket */}
              <path d="M 148 20 L 155 18 L 152 25 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
              <text x="80" y="95" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">v = {v.toFixed(0)} m/s</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}