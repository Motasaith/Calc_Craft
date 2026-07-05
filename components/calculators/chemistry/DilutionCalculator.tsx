'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function DilutionCalculator() {
  const [c1, setC1] = useState('5')
  const [v1, setV1] = useState('100')
  const [c2, setC2] = useState('1')

  const ci = parseFloat(c1), vi = parseFloat(v1), cf = parseFloat(c2)
  const valid = !isNaN(ci) && !isNaN(vi) && !isNaN(cf) && ci > 0 && vi > 0 && cf > 0
  const v2 = valid ? (ci * vi) / cf : 0
  const waterToAdd = valid ? v2 - vi : 0

  return (
    <FormCalculatorShell title="Dilution Calculator" subtitle="C₁V₁ = C₂V₂" badge="CHEMISTRY">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Initial Conc (C₁)" value={c1} onChange={setC1} placeholder="5" id="dl-c1" unit="M" />
        <RetroInput label="Initial Vol (V₁)" value={v1} onChange={setV1} placeholder="100" id="dl-v1" unit="mL" />
      </div>
      <RetroInput label="Final Conc (C₂)" value={c2} onChange={setC2} placeholder="1" id="dl-c2" unit="M" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Final Volume" value={v2.toFixed(1)} unit="mL" large />
            <ResultDisplay label="Solvent to Add" value={Math.max(0, waterToAdd).toFixed(1)} unit="mL" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Dilution Visual</span>
            <svg width="180" height="90" viewBox="0 0 180 90" className="select-none">
              <defs>
                <pattern id="dlGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="90" fill="url(#dlGrid)" rx="8" />
              {/* Before (concentrated) */}
              <path d={wobblyBar(25, 20, 30, 50)} fill="none" stroke="#6b7280" strokeWidth="2" />
              <path d={wobblyBar(25, 20 + 50 - Math.min(50, 50), 30, Math.min(50, 50))} fill="#34d399" fillOpacity="0.4" stroke="#059669" strokeWidth="1.5" />
              <text x="40" y="82" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#6b7280">V₁={vi}</text>
              {/* Arrow */}
              <path d="M 65 45 L 95 45" stroke="#9ca3af" strokeWidth="1.5" />
              <path d="M 95 45 L 90 41 L 90 49 Z" fill="#9ca3af" />
              {/* After (diluted) */}
              <path d={wobblyBar(105, 20, 50, 50)} fill="none" stroke="#6b7280" strokeWidth="2" />
              <path d={wobblyBar(105, 20 + 50 - Math.min(50, (v2 / Math.max(v2, 1)) * 50), 50, Math.min(50, (v2 / Math.max(v2, 1)) * 50))} fill="#34d399" fillOpacity="0.2" stroke="#059669" strokeWidth="1.5" />
              <text x="130" y="82" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#6b7280">V₂={v2.toFixed(0)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}