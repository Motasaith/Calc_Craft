'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PipeSizingCalculator() {
  const [flowRate, setFlowRate] = useState('20')
  const [maxVelocity, setMaxVelocity] = useState('8')

  const q = parseFloat(flowRate), v = parseFloat(maxVelocity)
  const valid = !isNaN(q) && !isNaN(v) && q > 0 && v > 0
  // Q (GPM) = A (in²) × v (ft/s) × 0.321 → A = Q / (v × 0.321)
  // d = 2 × sqrt(A / π)
  const areaIn2 = valid ? q / (v * 0.321) : 0
  const minDiameter = valid ? 2 * Math.sqrt(areaIn2 / Math.PI) : 0

  return (
    <FormCalculatorShell title="Pipe Sizing Calculator" subtitle="d = 2√(Q / (π·v·0.321))" badge="PLUMBING">
      <RetroInput label="Flow Rate" value={flowRate} onChange={setFlowRate} placeholder="20" id="ps-q" unit="GPM" />
      <RetroInput label="Max Velocity" value={maxVelocity} onChange={setMaxVelocity} placeholder="8" id="ps-v" unit="ft/s" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <ResultDisplay label="Min Pipe Diameter" value={minDiameter.toFixed(2)} unit="in" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Required Pipe Size</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="psGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#psGrid)" rx="8" />
              <path d={wobblyBar(20, 20, 120, 50)} fill="#cbd5e1" fillOpacity="0.3" stroke="#64748b" strokeWidth="2" />
              <circle cx="80" cy="45" r={Math.min(25, minDiameter * 3)} fill="#fbbf24" fillOpacity="0.35" stroke="#d97706" strokeWidth="1.5" />
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#d97706" fontWeight="bold">{minDiameter.toFixed(2)} in</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}