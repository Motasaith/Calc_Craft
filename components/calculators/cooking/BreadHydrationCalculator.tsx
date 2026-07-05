'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function BreadHydrationCalculator() {
  const [flour, setFlour] = useState('500')
  const [water, setWater] = useState('350')

  const f = parseFloat(flour), w = parseFloat(water)
  const valid = !isNaN(f) && !isNaN(w) && f > 0 && w > 0
  const hydration = valid ? (w / f) * 100 : 0
  const consistency = valid ? (hydration > 80 ? 'Very Wet' : hydration > 70 ? 'Wet' : hydration > 65 ? 'Standard' : hydration > 55 ? 'Stiff' : 'Very Stiff') : ''

  return (
    <FormCalculatorShell title="Bread Hydration" subtitle="Hydration = (Water / Flour) × 100" badge="COOKING">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Flour" value={flour} onChange={setFlour} placeholder="500" id="bh-f" unit="g" />
        <RetroInput label="Water" value={water} onChange={setWater} placeholder="350" id="bh-w" unit="g" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Hydration" value={hydration.toFixed(1)} unit="%" large />
            <ResultDisplay label="Dough Type" value={consistency} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Hydration Level</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="bhGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#bhGrid)" rx="8" />
              <path d={wobblyBar(15, 25, 150, 25)} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" rx="3" />
              <path d={wobblyBar(15, 25, Math.min(150, (hydration / 100) * 150), 25)} fill="#60a5fa" fillOpacity="0.4" stroke="#2563eb" strokeWidth="1.5" rx="3" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb" fontWeight="bold">{hydration.toFixed(0)}% — {consistency}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}