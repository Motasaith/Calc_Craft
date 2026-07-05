'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1, dy = y2 - y1
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist < 5) return `M ${x1} ${y1} L ${x2} ${y2}`
  const steps = Math.max(3, Math.floor(dist / 10))
  let path = `M ${x1} ${y1}`
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const jx = (Math.sin(i * 2.7) - 0.5) * 1.2
    path += ` L ${x1 + dx * t + jx} ${y1 + dy * t}`
  }
  return path
}

export default function PotentialEnergyCalculator() {
  const [mass, setMass] = useState('2')
  const [height, setHeight] = useState('10')
  const g = 9.81

  const m = parseFloat(mass), h = parseFloat(height)
  const valid = !isNaN(m) && !isNaN(h) && m >= 0 && h >= 0
  const pe = valid ? m * g * h : 0

  // Object height in SVG
  const objY = Math.max(15, 110 - (h / 50) * 80)

  return (
    <FormCalculatorShell title="Gravitational PE" subtitle="PE = m × g × h" badge="PHYSICS">
      <RetroInput label="Mass (m)" value={mass} onChange={setMass} placeholder="e.g. 2" id="pe-mass" unit="kg" />
      <RetroInput label="Height (h)" value={height} onChange={setHeight} placeholder="e.g. 10" id="pe-height" unit="m" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Potential Energy" value={pe.toFixed(2)} unit="J" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Height Diagram</span>
            <svg width="160" height="130" viewBox="0 0 160 130" className="select-none">
              <defs>
                <pattern id="peGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="130" fill="url(#peGrid)" rx="8" />
              {/* Ground */}
              <path d={wobblyLine(15, 115, 145, 115)} stroke="#4c5c4a" strokeWidth="2.5" />
              {/* Height line */}
              <path d={wobblyLine(80, 115, 80, objY)} stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4 3" />
              {/* Object */}
              <rect x="65" y={objY - 12} width="30" height="12" fill="#fbbf24" stroke="#d97706" strokeWidth="2" rx="2" />
              <text x="80" y={objY - 16} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#78350f">m</text>
              {/* Height label */}
              <text x="95" y={(115 + objY) / 2} fontSize="9" fontFamily="monospace" fill="#4c5c4a">h={h}m</text>
              <text x="80" y="128" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#78350f" fontWeight="bold">PE = {pe.toFixed(1)} J</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}