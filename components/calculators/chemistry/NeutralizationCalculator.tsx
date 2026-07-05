'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function NeutralizationCalculator() {
  const [acidM, setAcidM] = useState('0.1')
  const [acidV, setAcidV] = useState('25')
  const [baseM, setBaseM] = useState('0.1')

  const am = parseFloat(acidM), av = parseFloat(acidV), bm = parseFloat(baseM)
  const valid = !isNaN(am) && !isNaN(av) && !isNaN(bm) && am > 0 && av > 0 && bm > 0
  const baseV = valid ? (am * av) / bm : 0

  return (
    <FormCalculatorShell title="Neutralization" subtitle="M₁V₁ = M₂V₂" badge="CHEMISTRY">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Acid Conc (M₁)" value={acidM} onChange={setAcidM} placeholder="0.1" id="nt-am" unit="M" />
        <RetroInput label="Acid Vol (V₁)" value={acidV} onChange={setAcidV} placeholder="25" id="nt-av" unit="mL" />
      </div>
      <RetroInput label="Base Conc (M₂)" value={baseM} onChange={setBaseM} placeholder="0.1" id="nt-bm" unit="M" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Base Volume Needed" value={baseV.toFixed(2)} unit="mL" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Acid-Base Reaction</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="ntGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#ntGrid)" rx="8" />
              {/* Acid beaker */}
              <path d={wobblyBar(20, 25, 35, 40)} fill="none" stroke="#6b7280" strokeWidth="2" />
              <path d={wobblyBar(20, 25 + 40 - 25, 35, 25)} fill="#ef4444" fillOpacity="0.2" stroke="#dc2626" strokeWidth="1.5" />
              <text x="37" y="72" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#dc2626">Acid</text>
              {/* Plus sign */}
              <text x="75" y="48" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#6b7280">+</text>
              {/* Base beaker */}
              <path d={wobblyBar(90, 25, 35, 40)} fill="none" stroke="#6b7280" strokeWidth="2" />
              <path d={wobblyBar(90, 25 + 40 - Math.min(40, (baseV / Math.max(baseV, 1)) * 40), 35, Math.min(40, (baseV / Math.max(baseV, 1)) * 40))} fill="#3b82f6" fillOpacity="0.2" stroke="#2563eb" strokeWidth="1.5" />
              <text x="107" y="72" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#2563eb">Base</text>
              <text x="155" y="48" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">V₂={baseV.toFixed(1)}mL</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}