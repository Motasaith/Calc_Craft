'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function RecyclingCalculator() {
  const [paper, setPaper] = useState('50')
  const [plastic, setPlastic] = useState('20')
  const [glass, setGlass] = useState('15')

  const p = parseFloat(paper), pl = parseFloat(plastic), gl = parseFloat(glass)
  const valid = !isNaN(p) && !isNaN(pl) && !isNaN(gl) && p >= 0 && pl >= 0 && gl >= 0
  // CO2 saved: paper 4 kg/kg, plastic 2 kg/kg, glass 0.3 kg/kg
  const paperCO2 = valid ? p * 4 : 0
  const plasticCO2 = valid ? pl * 2 : 0
  const glassCO2 = valid ? gl * 0.3 : 0
  const total = valid ? paperCO2 + plasticCO2 + glassCO2 : 0

  return (
    <FormCalculatorShell title="Recycling Impact" subtitle="CO₂ saved by recycling" badge="ENVIRONMENT">
      <div className="grid grid-cols-3 gap-2">
        <RetroInput label="Paper" value={paper} onChange={setPaper} placeholder="50" id="rc-p" unit="kg" />
        <RetroInput label="Plastic" value={plastic} onChange={setPlastic} placeholder="20" id="rc-pl" unit="kg" />
        <RetroInput label="Glass" value={glass} onChange={setGlass} placeholder="15" id="rc-gl" unit="kg" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="CO₂ Saved" value={total.toFixed(1)} unit="kg" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Recycling Impact</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="rcGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#rcGrid)" rx="8" />
              <path d={wobblyBar(20, 45 - (paperCO2 / total) * 30, 45, (paperCO2 / total) * 30)} fill="#fbbf24" fillOpacity="0.4" stroke="#d97706" strokeWidth="1.5" />
              <text x="42" y="60" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#d97706">Paper</text>
              <path d={wobblyBar(70, 45 - (plasticCO2 / total) * 30, 45, (plasticCO2 / total) * 30)} fill="#60a5fa" fillOpacity="0.4" stroke="#2563eb" strokeWidth="1.5" />
              <text x="92" y="60" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#2563eb">Plastic</text>
              <path d={wobblyBar(120, 45 - (glassCO2 / total) * 30, 45, (glassCO2 / total) * 30)} fill="#22c55e" fillOpacity="0.4" stroke="#16a34a" strokeWidth="1.5" />
              <text x="142" y="60" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#16a34a">Glass</text>
              <text x="90" y="68" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#16a34a" fontWeight="bold">{total.toFixed(0)} kg CO₂ saved</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}