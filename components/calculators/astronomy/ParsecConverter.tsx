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

export default function ParsecConverter() {
  const [parsec, setParsec] = useState('1')

  const p = parseFloat(parsec)
  const valid = !isNaN(p) && p >= 0
  const ly = valid ? p * 3.262 : 0
  const au = valid ? p * 206265 : 0
  const km = valid ? p * 3.086e13 : 0

  return (
    <FormCalculatorShell title="Parsec Converter" subtitle="1 pc = 3.262 ly = 206265 AU" badge="ASTRONOMY">
      <RetroInput label="Parsecs" value={parsec} onChange={setParsec} placeholder="1" id="pc-p" unit="pc" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <ResultDisplay label="Light Years" value={ly.toFixed(4)} unit="ly" large />
            <ResultDisplay label="AU" value={au.toFixed(0)} unit="AU" large />
            <ResultDisplay label="Kilometers" value={km.toExponential(4)} unit="km" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Parallax Method</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="pcGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#pcGrid)" rx="8" />
              {/* Sun */}
              <path d={wobblyCircle(80, 75, 5)} fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              {/* Earth orbit */}
              <ellipse cx="80" cy="75" rx="25" ry="8" fill="none" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
              {/* Star at distance */}
              <path d={wobblyCircle(80, 20, 6)} fill="#a78bfa" stroke="#7c3aed" strokeWidth="2" />
              {/* Parallax angle */}
              <path d="M 55 75 L 80 20 L 105 75" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="80" y="88" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">{p} pc = {ly.toFixed(2)} ly</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}