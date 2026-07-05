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

export default function RedshiftCalculator() {
  const [observed, setObserved] = useState('700')
  const [emitted, setEmitted] = useState('500')

  const obs = parseFloat(observed), em = parseFloat(emitted)
  const valid = !isNaN(obs) && !isNaN(em) && em > 0 && obs > 0
  const z = valid ? (obs - em) / em : 0
  const c = 3e8
  const velocity = valid ? z * c : 0

  return (
    <FormCalculatorShell title="Redshift Calculator" subtitle="z = (λ_obs - λ_em) / λ_em" badge="ASTRONOMY">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Observed λ" value={observed} onChange={setObserved} placeholder="700" id="rs-o" unit="nm" />
        <RetroInput label="Emitted λ" value={emitted} onChange={setEmitted} placeholder="500" id="rs-e" unit="nm" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Redshift (z)" value={z.toFixed(6)} large />
            <ResultDisplay label="Velocity" value={(velocity / 1000).toFixed(2)} unit="km/s" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Spectral Shift</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="rsGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#rsGrid)" rx="8" />
              {/* Emitted line (blue/green) */}
              <path d="M 40 20 L 40 50" stroke="#3b82f6" strokeWidth="3" />
              <text x="40" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#3b82f6">em={em}nm</text>
              {/* Observed line (red shifted) */}
              <path d="M 120 20 L 120 50" stroke="#dc2626" strokeWidth="3" />
              <text x="120" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#dc2626">obs={obs}nm</text>
              {/* Shift arrow */}
              <path d="M 45 35 L 115 35" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 115 35 L 110 31 L 110 39 Z" fill="#9ca3af" />
              <text x="80" y="15" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">z = {z.toFixed(4)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}