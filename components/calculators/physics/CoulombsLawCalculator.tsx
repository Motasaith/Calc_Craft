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

export default function CoulombsLawCalculator() {
  const [q1, setQ1] = useState('1e-6')
  const [q2, setQ2] = useState('2e-6')
  const [r, setR] = useState('0.05')
  const k = 8.99e9

  const qa = parseFloat(q1), qb = parseFloat(q2), dist = parseFloat(r)
  const valid = !isNaN(qa) && !isNaN(qb) && !isNaN(dist) && dist > 0
  const force = valid ? (k * qa * qb) / (dist * dist) : 0

  return (
    <FormCalculatorShell title="Coulomb's Law" subtitle="F = k × q₁q₂ / r²" badge="PHYSICS">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Charge 1 (q₁)" value={q1} onChange={setQ1} placeholder="1e-6" id="cl-q1" unit="C" />
        <RetroInput label="Charge 2 (q₂)" value={q2} onChange={setQ2} placeholder="2e-6" id="cl-q2" unit="C" />
      </div>
      <RetroInput label="Distance (r)" value={r} onChange={setR} placeholder="0.05" id="cl-r" unit="m" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Electric Force" value={force.toExponential(4)} unit="N" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Two Charges</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="clGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#clGrid)" rx="8" />
              <path d={wobblyCircle(40, 35, 12)} fill="#dc2626" fillOpacity="0.2" stroke="#dc2626" strokeWidth="2" />
              <text x="40" y="38" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626">q₁</text>
              <path d={wobblyCircle(140, 35, 12)} fill="#2563eb" fillOpacity="0.2" stroke="#2563eb" strokeWidth="2" />
              <text x="140" y="38" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb">q₂</text>
              <path d="M 55 35 L 125 35" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="90" y="28" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#6b7280">r</text>
              <text x="90" y="62" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">F = {force.toExponential(2)} N</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}