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
    const jx = (Math.sin(i * 2.7) - 0.5) * 1.0
    path += ` L ${x1 + dx * t + jx} ${y1 + dy * t}`
  }
  return path
}

export default function PressureCalculator() {
  const [force, setForce] = useState('100')
  const [area, setArea] = useState('2')

  const f = parseFloat(force), a = parseFloat(area)
  const valid = !isNaN(f) && !isNaN(a) && f >= 0 && a > 0
  const pressure = valid ? f / a : 0

  return (
    <FormCalculatorShell title="Pressure Calculator" subtitle="P = F / A" badge="PHYSICS">
      <RetroInput label="Force (F)" value={force} onChange={setForce} placeholder="e.g. 100" id="pr-f" unit="N" />
      <RetroInput label="Area (A)" value={area} onChange={setArea} placeholder="e.g. 2" id="pr-a" unit="m²" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Pressure" value={pressure.toFixed(2)} unit="Pa" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Pressure on Surface</span>
            <svg width="180" height="100" viewBox="0 0 180 100" className="select-none">
              <defs>
                <pattern id="prGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="100" fill="url(#prGrid)" rx="8" />
              {/* Surface */}
              <path d={wobblyLine(20, 70, 160, 70)} stroke="#4c5c4a" strokeWidth="2.5" />
              {/* Force arrows pointing down */}
              <path d="M 60 20 L 60 55" stroke="#dc2626" strokeWidth="2" />
              <path d="M 60 55 L 55 48 L 65 48 Z" fill="#dc2626" />
              <path d="M 90 20 L 90 55" stroke="#dc2626" strokeWidth="2" />
              <path d="M 90 55 L 85 48 L 95 48 Z" fill="#dc2626" />
              <path d="M 120 20 L 120 55" stroke="#dc2626" strokeWidth="2" />
              <path d="M 120 55 L 115 48 L 125 48 Z" fill="#dc2626" />
              <text x="90" y="90" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#dc2626" fontWeight="bold">P = {pressure.toFixed(1)} Pa</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}