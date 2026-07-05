'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function SolutionMixCalculator() {
  const [m1, setM1] = useState('0.5')
  const [v1, setV1] = useState('100')
  const [m2, setM2] = useState('1.5')
  const [v2, setV2] = useState('50')

  const c1 = parseFloat(m1), vol1 = parseFloat(v1), c2 = parseFloat(m2), vol2 = parseFloat(v2)
  const valid = !isNaN(c1) && !isNaN(vol1) && !isNaN(c2) && !isNaN(vol2) && vol1 > 0 && vol2 > 0
  const totalMoles = valid ? c1 * vol1 + c2 * vol2 : 0
  const totalVol = valid ? vol1 + vol2 : 0
  const finalConc = valid && totalVol > 0 ? totalMoles / totalVol : 0

  return (
    <FormCalculatorShell title="Solution Mixer" subtitle="M = (C₁V₁ + C₂V₂) / (V₁+V₂)" badge="CHEMISTRY">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Solution 1 Conc" value={m1} onChange={setM1} placeholder="0.5" id="sm-c1" unit="M" />
        <RetroInput label="Solution 1 Vol" value={v1} onChange={setV1} placeholder="100" id="sm-v1" unit="mL" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Solution 2 Conc" value={m2} onChange={setM2} placeholder="1.5" id="sm-c2" unit="M" />
        <RetroInput label="Solution 2 Vol" value={v2} onChange={setV2} placeholder="50" id="sm-v2" unit="mL" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Final Concentration" value={finalConc.toFixed(4)} unit="M" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Mixing Visual</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="smGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#smGrid)" rx="8" />
              <path d={wobblyBar(15, 20, 30, 40)} fill="#3b82f6" fillOpacity="0.2" stroke="#2563eb" strokeWidth="1.5" />
              <text x="30" y="72" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#2563eb">Sol 1</text>
              <path d={wobblyBar(55, 20, 30, 40)} fill="#ef4444" fillOpacity="0.2" stroke="#dc2626" strokeWidth="1.5" />
              <text x="70" y="72" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#dc2626">Sol 2</text>
              <text x="100" y="45" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="#6b7280">→</text>
              <path d={wobblyBar(115, 20, 50, 40)} fill="#a78bfa" fillOpacity="0.25" stroke="#7c3aed" strokeWidth="2" />
              <text x="140" y="72" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#7c3aed">Mixed</text>
              <text x="140" y="12" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">{finalConc.toFixed(2)} M</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}