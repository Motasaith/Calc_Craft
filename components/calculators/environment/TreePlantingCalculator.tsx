'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function TreePlantingCalculator() {
  const [co2, setCo2] = useState('5000')

  const c = parseFloat(co2)
  const valid = !isNaN(c) && c >= 0
  // A mature tree absorbs ~22 kg CO2/year
  const treesNeeded = valid ? Math.ceil(c / 22) : 0
  const acresNeeded = valid ? treesNeeded / 400 : 0 // ~400 trees per acre

  return (
    <FormCalculatorShell title="Tree Offset Calculator" subtitle="Trees = CO₂ / 22 kg per tree" badge="ENVIRONMENT">
      <RetroInput label="Annual CO₂ (kg)" value={co2} onChange={setCo2} placeholder="5000" id="tr-c" unit="kg" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Trees Needed" value={treesNeeded} unit="trees" large />
            <ResultDisplay label="Area Needed" value={acresNeeded.toFixed(2)} unit="acres" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Tree Forest</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="trGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#trGrid)" rx="8" />
              {/* Ground */}
              <path d="M 15 65 L 145 65" stroke="#65a30d" strokeWidth="2" />
              {/* Trees */}
              {Array.from({ length: Math.min(10, treesNeeded) }).map((_, i) => (
                <g key={i}>
                  <path d={`M ${20 + i * 13} 65 L ${20 + i * 13} 50`} stroke="#78350f" strokeWidth="2" />
                  <path d={`M ${20 + i * 13 - 6} 50 L ${20 + i * 13} 35 L ${20 + i * 13 + 6} 50 Z`} fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" />
                </g>
              ))}
              <text x="80" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#16a34a" fontWeight="bold">{treesNeeded} trees needed</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}