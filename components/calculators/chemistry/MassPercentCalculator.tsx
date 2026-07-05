'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function MassPercentCalculator() {
  const [solute, setSolute] = useState('10')
  const [solvent, setSolvent] = useState('90')

  const s = parseFloat(solute), sv = parseFloat(solvent)
  const valid = !isNaN(s) && !isNaN(sv) && s >= 0 && sv >= 0 && (s + sv) > 0
  const total = valid ? s + sv : 0
  const percent = valid ? (s / total) * 100 : 0

  return (
    <FormCalculatorShell title="Mass Percent" subtitle="% = (solute / total) × 100" badge="CHEMISTRY">
      <RetroInput label="Solute Mass" value={solute} onChange={setSolute} placeholder="e.g. 10" id="mp-s" unit="g" />
      <RetroInput label="Solvent Mass" value={solvent} onChange={setSolvent} placeholder="e.g. 90" id="mp-sv" unit="g" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Mass Percent" value={percent.toFixed(2)} unit="%" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Solution Composition</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="mpGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#mpGrid)" rx="8" />
              {/* Total solution bar */}
              <path d={wobblyBar(20, 30, 120, 30)} fill="#34d399" fillOpacity="0.15" stroke="#059669" strokeWidth="2" />
              {/* Solute portion */}
              <path d={wobblyBar(20, 30, (percent / 100) * 120, 30)} fill="#fbbf24" fillOpacity="0.4" stroke="#d97706" strokeWidth="2" />
              <text x={20 + (percent / 100) * 60} y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#78350f">solute</text>
              <text x="80" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">{percent.toFixed(1)}% solute</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}