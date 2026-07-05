'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ThermalExpansionCalculator() {
  const [length, setLength] = useState('1')
  const [alpha, setAlpha] = useState('12e-6')
  const [dt, setDt] = useState('50')

  const l = parseFloat(length), a = parseFloat(alpha), deltaT = parseFloat(dt)
  const valid = !isNaN(l) && !isNaN(a) && !isNaN(deltaT) && l >= 0
  const deltaL = valid ? l * a * deltaT : 0
  const newLen = valid ? l + deltaL : 0

  const expandPct = Math.min(60, Math.abs(deltaL) * 500)

  return (
    <FormCalculatorShell title="Thermal Expansion" subtitle="ΔL = α × L₀ × ΔT" badge="PHYSICS">
      <RetroInput label="Initial Length (L₀)" value={length} onChange={setLength} placeholder="e.g. 1" id="te-l" unit="m" />
      <RetroInput label="Coeff (α)" value={alpha} onChange={setAlpha} placeholder="e.g. 12e-6" id="te-a" unit="/°C" />
      <RetroInput label="Temp Change (ΔT)" value={dt} onChange={setDt} placeholder="e.g. 50" id="te-dt" unit="°C" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Expansion" value={deltaL.toFixed(6)} unit="m" large />
            <ResultDisplay label="New Length" value={newLen.toFixed(6)} unit="m" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Expansion Visual</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="teGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#teGrid)" rx="8" />
              {/* Original bar */}
              <path d={wobblyBar(20, 25, 60, 15)} fill="#9ca3af" fillOpacity="0.3" stroke="#6b7280" strokeWidth="1.5" />
              {/* Expanded bar */}
              <path d={wobblyBar(20, 50, 60 + expandPct, 15)} fill="#f97316" fillOpacity="0.3" stroke="#ea580c" strokeWidth="2" />
              <text x="90" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ea580c" fontWeight="bold">ΔL = {deltaL.toFixed(4)} m</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}