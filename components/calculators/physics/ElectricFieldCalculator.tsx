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

export default function OhmsLawPhysicsCalculator() {
  const [charge, setCharge] = useState('0.5')
  const [radius, setRadius] = useState('0.1')

  const q = parseFloat(charge), r = parseFloat(radius)
  const valid = !isNaN(q) && !isNaN(r) && r > 0
  const k = 8.99e9
  const eField = valid ? (k * q) / (r * r) : 0

  return (
    <FormCalculatorShell title="Electric Field" subtitle="E = k × q / r²" badge="PHYSICS">
      <RetroInput label="Charge (q)" value={charge} onChange={setCharge} placeholder="e.g. 0.5" id="ef-q" unit="C" />
      <RetroInput label="Distance (r)" value={radius} onChange={setRadius} placeholder="e.g. 0.1" id="ef-r" unit="m" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Electric Field" value={eField.toExponential(4)} unit="N/C" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Field Lines</span>
            <svg width="140" height="120" viewBox="0 0 140 120" className="select-none">
              <defs>
                <pattern id="efGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="120" fill="url(#efGrid)" rx="8" />
              <path d={wobblyCircle(70, 55, 8)} fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <text x="70" y="58" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#78350f">q</text>
              {/* Radial field lines */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                const rad = (deg * Math.PI) / 180
                const x2 = 70 + 40 * Math.cos(rad)
                const y2 = 55 + 40 * Math.sin(rad)
                return <path key={deg} d={`M ${70 + 10 * Math.cos(rad)} ${55 + 10 * Math.sin(rad)} L ${x2} ${y2}`} stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#arrow)" />
              })}
              <text x="70" y="115" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb" fontWeight="bold">E = {eField.toExponential(2)} N/C</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}