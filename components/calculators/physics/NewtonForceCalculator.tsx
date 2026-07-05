'use client'
import React, { useState, useMemo } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

// Wobbly arrow generator (force vector)
function wobblyArrow(x1: number, y1: number, x2: number, y2: number, scale = 1) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 5) return `M ${x1} ${y1} L ${x2} ${y2}`
  const steps = Math.max(4, Math.floor(len / 12))
  let path = `M ${x1} ${y1}`
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const jx = (Math.sin(i * 2.3) * 1.2) * scale
    const jy = (Math.cos(i * 1.7) * 1.2) * scale
    path += ` L ${x1 + dx * t + jx} ${y1 + dy * t + jy}`
  }
  return path
}

export default function NewtonForceCalculator() {
  const [mass, setMass] = useState('10')
  const [accel, setAccel] = useState('2')

  const m = parseFloat(mass), a = parseFloat(accel)
  const valid = !isNaN(m) && !isNaN(a) && m >= 0
  const force = valid ? m * a : 0

  // Visualizer: arrow length scales with force
  const maxLen = 140
  const arrowLen = Math.min(maxLen, (force / 100) * maxLen + 20)

  return (
    <FormCalculatorShell title="Newton's Second Law" subtitle="F = m × a" badge="PHYSICS">
      <RetroInput label="Mass (m)" value={mass} onChange={setMass} placeholder="e.g. 10" id="nf-mass" unit="kg" />
      <RetroInput label="Acceleration (a)" value={accel} onChange={setAccel} placeholder="e.g. 2" id="nf-accel" unit="m/s²" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Force (F)" value={force.toFixed(2)} unit="N" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Force Vector</span>
            <svg width="200" height="80" viewBox="0 0 200 80" className="select-none">
              <defs>
                <pattern id="nfGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="200" height="80" fill="url(#nfGrid)" rx="8" />
              {/* Object box */}
              <path d={`M 25 30 L 55 30 L 55 50 L 25 50 Z`} fill="#fde68a" stroke="#a16207" strokeWidth="2" />
              <text x="40" y="44" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#78350f">m</text>
              {/* Force arrow */}
              <path d={wobblyArrow(60, 40, 60 + arrowLen, 40)} fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
              {/* Arrowhead */}
              <path d={`M ${60 + arrowLen} 40 L ${60 + arrowLen - 8} 34 L ${60 + arrowLen - 8} 46 Z`} fill="#dc2626" />
              <text x={60 + arrowLen / 2} y="28" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#dc2626" fontWeight="bold">F={force.toFixed(1)}N</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}