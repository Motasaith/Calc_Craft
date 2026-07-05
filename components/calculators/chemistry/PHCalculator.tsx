'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PHCalculator() {
  const [conc, setConc] = useState('0.001')

  const c = parseFloat(conc)
  const valid = !isNaN(c) && c > 0
  const ph = valid ? -Math.log10(c) : 0
  const isAcid = ph < 7
  const isNeutral = ph >= 6.5 && ph <= 7.5

  // Color based on pH
  const color = isNeutral ? '#22c55e' : isAcid ? '#ef4444' : '#3b82f6'

  return (
    <FormCalculatorShell title="pH Calculator" subtitle="pH = -log₁₀[H⁺]" badge="CHEMISTRY">
      <RetroInput label="H⁺ Concentration" value={conc} onChange={setConc} placeholder="e.g. 0.001" id="ph-c" unit="mol/L" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="pH Value" value={ph.toFixed(2)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">pH Scale</span>
            <svg width="200" height="80" viewBox="0 0 200 80" className="select-none">
              <defs>
                <pattern id="phGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="200" height="80" fill="url(#phGrid)" rx="8" />
              {/* pH scale bar */}
              <rect x="15" y="30" width="170" height="15" fill="url(#phGrad)" rx="3" />
              <defs>
                <linearGradient id="phGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              {/* Marker */}
              <path d={`M ${15 + Math.min(170, (ph / 14) * 170)} 25 L ${15 + Math.min(170, (ph / 14) * 170)} 50`} stroke={color} strokeWidth="3" />
              <circle cx={15 + Math.min(170, (ph / 14) * 170)} cy="22" r="5" fill={color} stroke="#fff" strokeWidth="1.5" />
              <text x="15" y="60" fontSize="7" fontFamily="monospace" fill="#6b7280">0</text>
              <text x="100" y="60" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#6b7280">7</text>
              <text x="180" y="60" fontSize="7" fontFamily="monospace" fill="#6b7280">14</text>
              <text x="100" y="75" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={color} fontWeight="bold">pH = {ph.toFixed(2)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}