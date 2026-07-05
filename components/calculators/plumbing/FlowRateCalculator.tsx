'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function FlowRateCalculator() {
  const [diameter, setDiameter] = useState('2')
  const [velocity, setVelocity] = useState('4')

  const d = parseFloat(diameter), v = parseFloat(velocity)
  const valid = !isNaN(d) && !isNaN(v) && d > 0 && v > 0
  // Q (GPM) = area (in²) × velocity (ft/s) × 0.321
  const areaIn2 = valid ? Math.PI * (d / 2) * (d / 2) : 0
  const gpm = valid ? areaIn2 * v * 0.321 : 0
  const lps = gpm * 0.06309

  return (
    <FormCalculatorShell title="Flow Rate Calculator" subtitle="Q = A × v" badge="PLUMBING">
      <RetroInput label="Pipe Diameter" value={diameter} onChange={setDiameter} placeholder="2" id="fr-d" unit="in" />
      <RetroInput label="Water Velocity" value={velocity} onChange={setVelocity} placeholder="4" id="fr-v" unit="ft/s" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Flow Rate" value={gpm.toFixed(2)} unit="GPM" large />
            <ResultDisplay label="Flow Rate" value={lps.toFixed(2)} unit="L/s" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Flow Visualization</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="frGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#frGrid)" rx="8" />
              <path d={wobblyBar(15, 35, 130, 20)} fill="#cbd5e1" fillOpacity="0.3" stroke="#64748b" strokeWidth="2" />
              <path d={wobblyBar(15, 38, Math.min(130, v * 20), 14)} fill="#60a5fa" fillOpacity="0.4" stroke="#2563eb" strokeWidth="1.5" />
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb" fontWeight="bold">{gpm.toFixed(1)} GPM</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}