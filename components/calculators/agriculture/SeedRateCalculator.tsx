'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function SeedRateCalculator() {
  const [area, setArea] = useState('1')
  const [spacing, setSpacing] = useState('30')
  const [rowSpace, setRowSpace] = useState('60')

  const a = parseFloat(area), sp = parseFloat(spacing), rs = parseFloat(rowSpace)
  const valid = !isNaN(a) && !isNaN(sp) && !isNaN(rs) && a > 0 && sp > 0 && rs > 0
  // area in m², spacing in cm → convert to m
  const plantsPerM2 = valid ? 10000 / (sp * rs) : 0 // 10000 cm² per m²
  const totalPlants = valid ? plantsPerM2 * a * 10000 : 0 // area in ha → m²

  return (
    <FormCalculatorShell title="Seed Rate Calculator" subtitle="Plants = (Area × 10000) / (spacing × row)" badge="AGRICULTURE">
      <RetroInput label="Area" value={area} onChange={setArea} placeholder="1" id="sd-a" unit="ha" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Plant Spacing" value={spacing} onChange={setSpacing} placeholder="30" id="sd-sp" unit="cm" />
        <RetroInput label="Row Spacing" value={rowSpace} onChange={setRowSpace} placeholder="60" id="sd-rs" unit="cm" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Plants/m²" value={plantsPerM2.toFixed(1)} large />
            <ResultDisplay label="Total Plants" value={totalPlants.toFixed(0)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Plant Grid</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="sdGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#sdGrid)" rx="8" />
              <path d={wobblyRect(20, 15, 120, 60)} fill="#84cc16" fillOpacity="0.1" stroke="#65a30d" strokeWidth="2" />
              {/* Plant dots in grid */}
              {Array.from({ length: 4 }).map((_, row) => (
                Array.from({ length: 6 }).map((_, col) => (
                  <circle key={`${row}-${col}`} cx={30 + col * 20} cy={25 + row * 15} r="3" fill="#65a30d" />
                ))
              ))}
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#65a30d" fontWeight="bold">{totalPlants.toFixed(0)} plants</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}