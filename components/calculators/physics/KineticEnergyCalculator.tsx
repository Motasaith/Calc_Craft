'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  const steps = 32
  let path = ''
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2
    const jitter = (Math.sin(i * 3.1) - 0.5) * 1.5
    const x = cx + (r + jitter) * Math.cos(theta)
    const y = cy + (r + jitter) * Math.sin(theta)
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return path + ' Z'
}

export default function KineticEnergyCalculator() {
  const [mass, setMass] = useState('5')
  const [vel, setVel] = useState('10')

  const m = parseFloat(mass), v = parseFloat(vel)
  const valid = !isNaN(m) && !isNaN(v) && m >= 0
  const ke = valid ? 0.5 * m * v * v : 0

  // Energy bar height scales with KE
  const barH = Math.min(100, (ke / 500) * 100 + 10)

  return (
    <FormCalculatorShell title="Kinetic Energy" subtitle="KE = ½ × m × v²" badge="PHYSICS">
      <RetroInput label="Mass (m)" value={mass} onChange={setMass} placeholder="e.g. 5" id="ke-mass" unit="kg" />
      <RetroInput label="Velocity (v)" value={vel} onChange={setVel} placeholder="e.g. 10" id="ke-vel" unit="m/s" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Kinetic Energy" value={ke.toFixed(2)} unit="J" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Energy Ball</span>
            <svg width="160" height="120" viewBox="0 0 160 120" className="select-none">
              <defs>
                <pattern id="keGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="120" fill="url(#keGrid)" rx="8" />
              {/* Moving object */}
              <path d={wobblyCircle(80, 60, Math.min(40, 10 + barH / 3))} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="2" />
              {/* Motion lines */}
              <path d="M 20 50 L 50 50" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 20 60 L 55 60" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 20 70 L 50 70" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="80" y="105" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#78350f" fontWeight="bold">KE = {ke.toFixed(1)} J</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}