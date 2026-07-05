'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`
}

export default function LandscapeRockCalculator() {
  const [area, setArea] = useState('200')
  const [depth, setDepth] = useState('2')
  const [rockType, setRockType] = useState('river')

  const a = parseFloat(area) || 0
  const d = parseFloat(depth) || 0

  const cubicFeet = (a * d) / 12
  const cubicYards = cubicFeet / 27
  const tons = cubicYards * 1.4
  const pricePerTon = rockType === 'river' ? 130 : rockType === 'lava' ? 200 : 90
  const cost = tons * pricePerTon

  const valid = a > 0 && d > 0

  return (
    <FormCalculatorShell
      title="Landscape Rock Calculator"
      subtitle="Estimate rock tonnage and cost by type"
      badge="LANDSCAPING"
    >
      <div>
        <RetroInput label="Coverage Area" value={area} onChange={setArea} unit="sq ft" min={0} />
        <RetroInput label="Depth" value={depth} onChange={setDepth} unit="in" min={0} />
        <div className="mb-3">
          <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
            Rock Type
          </label>
          <select
            value={rockType}
            onChange={(e) => setRockType(e.target.value)}
            className="w-full h-10 px-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500"
          >
            <option value="river">River Rock ($130/ton)</option>
            <option value="lava">Lava Rock ($200/ton)</option>
            <option value="crushed">Crushed Stone ($90/ton)</option>
          </select>
        </div>
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Tons Needed" value={tons.toFixed(2)} unit="tons" large />
          <ResultDisplay label="Estimated Cost" value={`$${cost.toFixed(2)}`} />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <rect x="0" y="0" width="200" height="80" fill="#d8d4cc" />
        {Array.from({ length: 7 }).map((_, i) => (
          <path
            key={i}
            d={wobblyCircle(20 + i * 27, 40 + (i % 2) * 8, 10 + (i % 3) * 2)}
            fill={rockType === 'lava' ? '#8a3a2a' : rockType === 'river' ? '#6a6a6a' : '#9a9a8a'}
            opacity={valid ? 0.85 : 0.3}
          />
        ))}
      </svg>
    </FormCalculatorShell>
  )
}