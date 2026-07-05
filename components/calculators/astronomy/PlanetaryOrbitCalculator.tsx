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

export default function PlanetaryOrbitCalculator() {
  const [semiMajor, setSemiMajor] = useState('1')
  const [bodyMass, setBodyMass] = useState('1.989e30')
  const G = 6.674e-11

  const a = parseFloat(semiMajor), m = parseFloat(bodyMass)
  const valid = !isNaN(a) && !isNaN(m) && a > 0 && m > 0
  // a in AU → convert to meters: 1 AU = 1.496e11 m
  const aMeters = a * 1.496e11
  const period = valid ? 2 * Math.PI * Math.sqrt((aMeters ** 3) / (G * m)) : 0
  const periodYears = valid ? period / (365.25 * 24 * 3600) : 0

  return (
    <FormCalculatorShell title="Kepler's Third Law" subtitle="T² = 4π²a³ / (GM)" badge="ASTRONOMY">
      <RetroInput label="Semi-Major Axis (a)" value={semiMajor} onChange={setSemiMajor} placeholder="1" id="kp-a" unit="AU" />
      <RetroInput label="Central Mass (M)" value={bodyMass} onChange={setBodyMass} placeholder="1.989e30" id="kp-m" unit="kg" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Orbital Period" value={periodYears.toFixed(4)} unit="years" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Elliptical Orbit</span>
            <svg width="160" height="100" viewBox="0 0 160 100" className="select-none">
              <defs>
                <pattern id="kpGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="100" fill="url(#kpGrid)" rx="8" />
              {/* Elliptical orbit */}
              <ellipse cx="80" cy="50" rx="55" ry="25" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Star at focus */}
              <path d={wobblyCircle(55, 50, 8)} fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              {/* Planet */}
              <circle cx="135" cy="50" r="5" fill="#a78bfa" stroke="#7c3aed" strokeWidth="2" />
              <text x="80" y="95" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">T = {periodYears.toFixed(2)} yr</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}