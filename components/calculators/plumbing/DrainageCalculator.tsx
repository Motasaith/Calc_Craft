'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function DrainageCalculator() {
  const [diameter, setDiameter] = useState('4')
  const [slope, setSlope] = useState('1')

  const d = parseFloat(diameter), s = parseFloat(slope)
  const valid = !isNaN(d) && !isNaN(s) && d > 0 && s > 0
  // Manning equation approximation for drainage capacity
  // Q (GPM) ≈ 0.040 × d^2.67 × sqrt(s)  (d in inches, s in %)
  const gpm = valid ? 0.040 * Math.pow(d, 2.67) * Math.sqrt(s) : 0

  return (
    <FormCalculatorShell title="Drainage Calculator" subtitle="Q = 0.040 × d^2.67 × √s" badge="PLUMBING">
      <RetroInput label="Pipe Diameter" value={diameter} onChange={setDiameter} placeholder="4" id="dr-d" unit="in" />
      <RetroInput label="Slope" value={slope} onChange={setSlope} placeholder="1" id="dr-s" unit="%" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <ResultDisplay label="Drainage Capacity" value={gpm.toFixed(1)} unit="GPM" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Drain Flow</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="drGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#drGrid)" rx="8" />
              <path d={wobblyBar(15, 50, 130, 20)} fill="#cbd5e1" fillOpacity="0.3" stroke="#64748b" strokeWidth="2" />
              <path d={wobblyBar(15, 53, Math.min(130, gpm * 2), 14)} fill="#22c55e" fillOpacity="0.4" stroke="#16a34a" strokeWidth="1.5" />
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#16a34a" fontWeight="bold">{gpm.toFixed(0)} GPM</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}