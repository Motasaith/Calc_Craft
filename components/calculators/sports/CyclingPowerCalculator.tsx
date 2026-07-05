'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CyclingPowerCalculator() {
  const [weight, setWeight] = useState('70')
  const [power, setPower] = useState('250')

  const w = parseFloat(weight), p = parseFloat(power)
  const valid = !isNaN(w) && !isNaN(p) && w > 0 && p > 0
  const pwrRatio = valid ? p / w : 0
  const category = valid ? (pwrRatio > 5 ? 'World Class' : pwrRatio > 4 ? 'Pro' : pwrRatio > 3 ? 'Cat 1' : pwrRatio > 2.5 ? 'Cat 2' : pwrRatio > 2 ? 'Cat 3' : 'Recreational') : ''

  return (
    <FormCalculatorShell title="Cycling Power-to-Weight" subtitle="W/kg = Power / Weight" badge="SPORTS">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Body Weight" value={weight} onChange={setWeight} placeholder="70" id="cp-w" unit="kg" />
        <RetroInput label="Power Output" value={power} onChange={setPower} placeholder="250" id="cp-p" unit="W" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Power Ratio" value={pwrRatio.toFixed(2)} unit="W/kg" large />
            <ResultDisplay label="Category" value={category} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Power Level</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="cpGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#cpGrid)" rx="8" />
              <path d={wobblyBar(15, 25, 150, 25)} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" rx="3" />
              <path d={wobblyBar(15, 25, Math.min(150, (pwrRatio / 6) * 150), 25)} fill="#f97316" fillOpacity="0.4" stroke="#ea580c" strokeWidth="1.5" rx="3" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ea580c" fontWeight="bold">{pwrRatio.toFixed(2)} W/kg — {category}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}