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

export default function BohrRadiusCalculator() {
  const [n, setN] = useState('1')
  const a0 = 5.29e-11 // Bohr radius in meters

  const level = parseInt(n)
  const valid = !isNaN(level) && level > 0
  const radius = valid ? a0 * level * level : 0

  return (
    <FormCalculatorShell title="Bohr Radius" subtitle="r = a₀ × n²" badge="CHEMISTRY">
      <RetroInput label="Energy Level (n)" value={n} onChange={setN} placeholder="e.g. 1" id="br-n" unit="" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Orbit Radius" value={radius.toExponential(4)} unit="m" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Bohr Model</span>
            <svg width="140" height="120" viewBox="0 0 140 120" className="select-none">
              <defs>
                <pattern id="brGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="120" fill="url(#brGrid)" rx="8" />
              {/* Nucleus */}
              <path d={wobblyCircle(70, 55, 8)} fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              {/* Orbits */}
              {[1, 2, 3].map((lvl) => (
                <path key={lvl} d={wobblyCircle(70, 55, 15 + lvl * 12)} fill="none" stroke={lvl === level ? '#dc2626' : '#9ca3af'} strokeWidth={lvl === level ? 2 : 1} strokeDasharray={lvl === level ? '0' : '3 3'} />
              ))}
              {/* Electron on selected orbit */}
              <circle cx={70 + 15 + level * 12} cy="55" r="5" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
              <text x="70" y="115" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">n={level}, r={radius.toExponential(2)}m</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}