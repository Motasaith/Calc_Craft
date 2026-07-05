'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function SpecificHeatCalculator() {
  const [mass, setMass] = useState('1')
  const [sh, setSh] = useState('4186')
  const [dt, setDt] = useState('10')

  const m = parseFloat(mass), c = parseFloat(sh), deltaT = parseFloat(dt)
  const valid = !isNaN(m) && !isNaN(c) && !isNaN(deltaT) && m >= 0
  const q = valid ? m * c * deltaT : 0

  const barH = Math.min(90, (q / 50000) * 90 + 8)

  return (
    <FormCalculatorShell title="Specific Heat" subtitle="Q = m × c × ΔT" badge="PHYSICS">
      <RetroInput label="Mass (m)" value={mass} onChange={setMass} placeholder="e.g. 1" id="sh-m" unit="kg" />
      <RetroInput label="Specific Heat (c)" value={sh} onChange={setSh} placeholder="e.g. 4186" id="sh-c" unit="J/(kg·K)" />
      <RetroInput label="Temp Change (ΔT)" value={dt} onChange={setDt} placeholder="e.g. 10" id="sh-dt" unit="°C" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Heat Energy" value={q.toFixed(2)} unit="J" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Heat Energy Bar</span>
            <svg width="160" height="120" viewBox="0 0 160 120" className="select-none">
              <defs>
                <pattern id="shGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="120" fill="url(#shGrid)" rx="8" />
              <path d={wobblyBar(60, 110 - barH, 40, barH)} fill="#f97316" fillOpacity="0.4" stroke="#ea580c" strokeWidth="2" />
              <path d="M 55 110 L 105 110" stroke="#4c5c4a" strokeWidth="2" />
              <text x="80" y="118" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ea580c" fontWeight="bold">Q = {q.toFixed(0)} J</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}