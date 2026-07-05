'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function FertilizerCalculator() {
  const [area, setArea] = useState('1000')
  const [rate, setRate] = useState('50')

  const a = parseFloat(area), r = parseFloat(rate)
  const valid = !isNaN(a) && !isNaN(r) && a > 0 && r >= 0
  const total = valid ? (a * r) / 1000 : 0 // kg

  return (
    <FormCalculatorShell title="Fertilizer Calculator" subtitle="Amount = Area × Rate" badge="AGRICULTURE">
      <RetroInput label="Field Area" value={area} onChange={setArea} placeholder="1000" id="fr-a" unit="m²" />
      <RetroInput label="Application Rate" value={rate} onChange={setRate} placeholder="50" id="fr-r" unit="kg/ha" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Fertilizer Needed" value={total.toFixed(2)} unit="kg" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Field Layout</span>
            <svg width="160" height="100" viewBox="0 0 160 100" className="select-none">
              <defs>
                <pattern id="frGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="100" fill="url(#frGrid)" rx="8" />
              <path d={wobblyRect(20, 15, 120, 65)} fill="#84cc16" fillOpacity="0.15" stroke="#65a30d" strokeWidth="2" />
              {/* Fertilizer dots */}
              {Array.from({ length: 15 }).map((_, i) => (
                <circle key={i} cx={30 + (i % 5) * 25} cy={25 + Math.floor(i / 5) * 20} r="2" fill="#a16207" />
              ))}
              <text x="80" y="95" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#65a30d" fontWeight="bold">{total.toFixed(1)} kg needed</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}