'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyArrow(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 5) return `M ${x1} ${y1} L ${x2} ${y2}`
  const steps = Math.max(4, Math.floor(len / 12))
  let path = `M ${x1} ${y1}`
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const jy = (Math.sin(i * 2.7) - 0.5) * 1.0
    path += ` L ${x1 + dx * t} ${y1 + dy * t + jy}`
  }
  return path
}

export default function MomentumCalculator() {
  const [mass, setMass] = useState('10')
  const [vel, setVel] = useState('5')

  const m = parseFloat(mass), v = parseFloat(vel)
  const valid = !isNaN(m) && !isNaN(v) && m >= 0
  const p = valid ? m * v : 0

  const arrowLen = Math.min(120, (p / 200) * 120 + 15)

  return (
    <FormCalculatorShell title="Momentum Calculator" subtitle="p = m × v" badge="PHYSICS">
      <RetroInput label="Mass (m)" value={mass} onChange={setMass} placeholder="e.g. 10" id="mom-m" unit="kg" />
      <RetroInput label="Velocity (v)" value={vel} onChange={setVel} placeholder="e.g. 5" id="mom-v" unit="m/s" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Momentum" value={p.toFixed(2)} unit="kg·m/s" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Momentum Vector</span>
            <svg width="200" height="70" viewBox="0 0 200 70" className="select-none">
              <defs>
                <pattern id="pGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="200" height="70" fill="url(#pGrid)" rx="8" />
              <rect x="20" y="25" width="25" height="20" fill="#fbbf24" stroke="#d97706" strokeWidth="2" rx="3" />
              <text x="32" y="38" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#78350f">m</text>
              <path d={wobblyArrow(50, 35, 50 + arrowLen, 35)} stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
              <path d={`M ${50 + arrowLen} 35 L ${50 + arrowLen - 8} 29 L ${50 + arrowLen - 8} 41 Z`} fill="#7c3aed" />
              <text x={50 + arrowLen / 2} y="20" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">p = {p.toFixed(1)} kg·m/s</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}