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

export default function GravitationalForceCalculator() {
  const [m1, setM1] = useState('5.972e24')
  const [m2, setM2] = useState('7.342e22')
  const [r, setR] = useState('3.844e8')
  const G = 6.674e-11

  const ma = parseFloat(m1), mb = parseFloat(m2), dist = parseFloat(r)
  const valid = !isNaN(ma) && !isNaN(mb) && !isNaN(dist) && dist > 0
  const force = valid ? (G * ma * mb) / (dist * dist) : 0

  return (
    <FormCalculatorShell title="Gravitational Force" subtitle="F = G × m₁m₂ / r²" badge="PHYSICS">
      <RetroInput label="Mass 1 (m₁)" value={m1} onChange={setM1} placeholder="e.g. 5.972e24" id="gf-m1" unit="kg" />
      <RetroInput label="Mass 2 (m₂)" value={m2} onChange={setM2} placeholder="e.g. 7.342e22" id="gf-m2" unit="kg" />
      <RetroInput label="Distance (r)" value={r} onChange={setR} placeholder="e.g. 3.844e8" id="gf-r" unit="m" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Gravitational Force" value={force.toExponential(4)} unit="N" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Two-Body System</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="gfGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#gfGrid)" rx="8" />
              <path d={wobblyCircle(35, 40, 18)} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="2" />
              <text x="35" y="43" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#78350f">m₁</text>
              <path d={wobblyCircle(145, 40, 10)} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" />
              <text x="145" y="43" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed">m₂</text>
              <path d="M 55 40 L 133 40" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="90" y="33" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#6b7280">r</text>
              <text x="90" y="72" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">F = {force.toExponential(2)} N</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}