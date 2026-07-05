'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblySpring(x: number, y: number, coils: number, height: number) {
  const steps = coils * 8
  let path = `M ${x} ${y}`
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const yPos = y + height * t
    const xPos = x + Math.sin(t * coils * Math.PI * 2) * 12 + (Math.sin(i * 3.1) - 0.5) * 0.6
    path += ` L ${xPos} ${yPos}`
  }
  return path
}

export default function SpringForceCalculator() {
  const [k, setK] = useState('200')
  const [x, setX] = useState('0.05')

  const kv = parseFloat(k), xv = parseFloat(x)
  const valid = !isNaN(kv) && !isNaN(xv) && kv >= 0
  const force = valid ? -kv * xv : 0
  const pe = valid ? 0.5 * kv * xv * xv : 0

  // Spring stretch visualization
  const stretch = Math.min(60, Math.abs(xv) * 800)

  return (
    <FormCalculatorShell title="Hooke's Law" subtitle="F = -k × x" badge="PHYSICS">
      <RetroInput label="Spring Constant (k)" value={k} onChange={setK} placeholder="e.g. 200" id="hk-k" unit="N/m" />
      <RetroInput label="Displacement (x)" value={x} onChange={setX} placeholder="e.g. 0.05" id="hk-x" unit="m" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Restoring Force" value={force.toFixed(2)} unit="N" large />
            <ResultDisplay label="Spring PE" value={pe.toFixed(4)} unit="J" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Spring Diagram</span>
            <svg width="160" height="120" viewBox="0 0 160 120" className="select-none">
              <defs>
                <pattern id="hkGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="120" fill="url(#hkGrid)" rx="8" />
              {/* Wall */}
              <path d="M 20 20 L 20 100" stroke="#4c5c4a" strokeWidth="3" />
              <path d="M 15 25 L 20 20 L 25 25" fill="none" stroke="#4c5c4a" strokeWidth="1.5" />
              {/* Spring */}
              <path d={wobblySpring(25, 30, 8, 40 + stretch)} fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
              {/* Mass */}
              <rect x={25 + 12 - 15} y={30 + 40 + stretch - 5} width="30" height="20" fill="#fbbf24" stroke="#d97706" strokeWidth="2" rx="3" />
              <text x={25 + 12} y={30 + 40 + stretch + 8} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#78350f">m</text>
              <text x="80" y="115" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">F = {force.toFixed(1)} N</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}