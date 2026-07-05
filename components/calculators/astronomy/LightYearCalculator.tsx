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

export default function LightYearCalculator() {
  const [ly, setLy] = useState('4.24')

  const l = parseFloat(ly)
  const valid = !isNaN(l) && l >= 0
  const km = valid ? l * 9.461e12 : 0
  const au = valid ? l * 63241 : 0
  const parsec = valid ? l / 3.262 : 0

  return (
    <FormCalculatorShell title="Light Year Converter" subtitle="1 ly = 9.461 × 10¹² km" badge="ASTRONOMY">
      <RetroInput label="Light Years" value={ly} onChange={setLy} placeholder="e.g. 4.24" id="ly-l" unit="ly" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <ResultDisplay label="Kilometers" value={km.toExponential(4)} unit="km" large />
            <ResultDisplay label="Astronomical Units" value={au.toFixed(0)} unit="AU" large />
            <ResultDisplay label="Parsecs" value={parsec.toFixed(4)} unit="pc" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Distance Scale</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="lyGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#lyGrid)" rx="8" />
              {/* Sun */}
              <path d={wobblyCircle(25, 40, 8)} fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              {/* Distance line */}
              <path d="M 35 40 L 155 40" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Star */}
              <path d={wobblyCircle(160, 40, 6)} fill="#a78bfa" stroke="#7c3aed" strokeWidth="2" />
              <text x="90" y="30" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">{l} light years</text>
              <text x="90" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#6b7280">{parsec.toFixed(2)} parsecs</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}