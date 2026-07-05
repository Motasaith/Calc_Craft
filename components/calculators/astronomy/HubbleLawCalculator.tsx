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

export default function HubbleLawCalculator() {
  const [distance, setDistance] = useState('1e6')
  const H0 = 70 // km/s/Mpc

  const d = parseFloat(distance)
  const valid = !isNaN(d) && d >= 0
  const v = valid ? H0 * d : 0 // km/s

  return (
    <FormCalculatorShell title="Hubble's Law" subtitle="v = H₀ × d" badge="ASTRONOMY">
      <RetroInput label="Distance (d)" value={distance} onChange={setDistance} placeholder="1e6" id="hb-d" unit="Mpc" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Recession Velocity" value={v.toExponential(4)} unit="km/s" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Expanding Universe</span>
            <svg width="160" height="100" viewBox="0 0 160 100" className="select-none">
              <defs>
                <pattern id="hbGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="100" fill="url(#hbGrid)" rx="8" />
              {/* Observer galaxy */}
              <path d={wobblyCircle(80, 50, 8)} fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              {/* Distant galaxies moving away */}
              <path d={wobblyCircle(30, 30, 5)} fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5" />
              <path d="M 35 30 L 15 20" stroke="#dc2626" strokeWidth="1.5" />
              <path d={wobblyCircle(130, 70, 5)} fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5" />
              <path d="M 125 70 L 145 80" stroke="#dc2626" strokeWidth="1.5" />
              <path d={wobblyCircle(130, 25, 5)} fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5" />
              <path d="M 125 25 L 145 15" stroke="#dc2626" strokeWidth="1.5" />
              <text x="80" y="95" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">v = {v.toExponential(2)} km/s</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}