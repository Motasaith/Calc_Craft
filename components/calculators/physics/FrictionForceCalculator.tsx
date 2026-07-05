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

export default function FrictionForceCalculator() {
  const [mu, setMu] = useState('0.3')
  const [normal, setNormal] = useState('100')

  const u = parseFloat(mu), n = parseFloat(normal)
  const valid = !isNaN(u) && !isNaN(n) && u >= 0 && n >= 0
  const friction = valid ? u * n : 0

  return (
    <FormCalculatorShell title="Friction Force" subtitle="Ff = μ × N" badge="PHYSICS">
      <RetroInput label="Coefficient (μ)" value={mu} onChange={setMu} placeholder="e.g. 0.3" id="fr-mu" unit="" />
      <RetroInput label="Normal Force (N)" value={normal} onChange={setNormal} placeholder="e.g. 100" id="fr-n" unit="N" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Friction Force" value={friction.toFixed(2)} unit="N" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Block on Surface</span>
            <svg width="180" height="90" viewBox="0 0 180 90" className="select-none">
              <defs>
                <pattern id="frGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="90" fill="url(#frGrid)" rx="8" />
              <path d={wobblyLine(15, 65, 165, 65)} stroke="#4c5c4a" strokeWidth="2.5" />
              {/* Surface texture */}
              <path d="M 20 68 L 25 72 M 35 68 L 40 72 M 50 68 L 55 72 M 65 68 L 70 72 M 80 68 L 85 72 M 95 68 L 100 72 M 110 68 L 115 72 M 125 68 L 130 72 M 140 68 L 145 72" stroke="#9ca3af" strokeWidth="1" />
              <rect x="55" y="42" width="35" height="23" fill="#fde68a" stroke="#a16207" strokeWidth="2" rx="2" />
              <text x="72" y="57" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#78350f">m</text>
              {/* Friction force arrow (opposing motion) */}
              <path d="M 95 53 L 130 53" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 130 53 L 124 48 L 124 58 Z" fill="#dc2626" />
              <text x="112" y="40" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">Ff={friction.toFixed(0)}N</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}