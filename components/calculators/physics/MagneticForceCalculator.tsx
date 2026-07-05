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

export default function MagneticForceCalculator() {
  const [charge, setCharge] = useState('1')
  const [vel, setVel] = useState('10')
  const [b, setB] = useState('0.5')
  const [angle, setAngle] = useState('90')

  const q = parseFloat(charge), v = parseFloat(vel), bField = parseFloat(b), ang = parseFloat(angle)
  const valid = !isNaN(q) && !isNaN(v) && !isNaN(bField) && !isNaN(ang)
  const rad = (ang * Math.PI) / 180
  const force = valid ? q * v * bField * Math.sin(rad) : 0

  return (
    <FormCalculatorShell title="Magnetic Force" subtitle="F = q × v × B × sin(θ)" badge="PHYSICS">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Charge (q)" value={charge} onChange={setCharge} placeholder="1" id="mf-q" unit="C" />
        <RetroInput label="Velocity (v)" value={vel} onChange={setVel} placeholder="10" id="mf-v" unit="m/s" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Magnetic Field (B)" value={b} onChange={setB} placeholder="0.5" id="mf-b" unit="T" />
        <RetroInput label="Angle (θ)" value={angle} onChange={setAngle} placeholder="90" id="mf-a" unit="°" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Magnetic Force" value={force.toFixed(4)} unit="N" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Charge in B-Field</span>
            <svg width="140" height="100" viewBox="0 0 140 100" className="select-none">
              <defs>
                <pattern id="mfGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="100" fill="url(#mfGrid)" rx="8" />
              {/* B-field crosses (into page) */}
              {[30, 55, 80, 105].map((x) => (
                [25, 50, 75].map((y) => (
                  <g key={`${x}-${y}`}>
                    <path d={`M ${x - 4} ${y - 4} L ${x + 4} ${y + 4}`} stroke="#9ca3af" strokeWidth="1" />
                    <path d={`M ${x - 4} ${y + 4} L ${x + 4} ${y - 4}`} stroke="#9ca3af" strokeWidth="1" />
                  </g>
                ))
              ))}
              {/* Moving charge */}
              <path d={wobblyCircle(70, 50, 8)} fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <text x="70" y="53" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#78350f">q</text>
              {/* Force arrow */}
              <path d="M 78 50 L 110 50" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 110 50 L 104 45 L 104 55 Z" fill="#dc2626" />
              <text x="70" y="95" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">F = {force.toFixed(2)} N</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}