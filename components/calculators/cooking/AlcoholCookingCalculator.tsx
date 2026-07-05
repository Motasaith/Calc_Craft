'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function AlcoholCookingCalculator() {
  const [alcohol, setAlcohol] = useState('40')
  const [time, setTime] = useState('60')

  const a = parseFloat(alcohol), t = parseFloat(time)
  const valid = !isNaN(a) && !isNaN(t) && a > 0 && t >= 0
  // Remaining alcohol after cooking: ~85% at 0min, 75% at 15min, 45% at 60min, 25% at 120min, 5% at 180min
  const remaining = valid ? t === 0 ? 100 : t < 15 ? 95 - (t / 15) * 20 : t < 60 ? 75 - ((t - 15) / 45) * 30 : t < 120 ? 45 - ((t - 60) / 60) * 20 : t < 180 ? 25 - ((t - 120) / 60) * 20 : 5 : 0

  return (
    <FormCalculatorShell title="Alcohol Retention" subtitle="% alcohol after cooking" badge="COOKING">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="ABV %" value={alcohol} onChange={setAlcohol} placeholder="40" id="al-a" unit="%" />
        <RetroInput label="Cooking Time" value={time} onChange={setTime} placeholder="60" id="al-t" unit="min" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Alcohol Remaining" value={remaining.toFixed(1)} unit="%" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Retention Curve</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="alGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#alGrid)" rx="8" />
              <path d={wobblyBar(15, 25, 150, 25)} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" rx="3" />
              <path d={wobblyBar(15, 25, Math.min(150, (remaining / 100) * 150), 25)} fill="#7c3aed" fillOpacity="0.4" stroke="#7c3aed" strokeWidth="1.5" rx="3" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">{remaining.toFixed(0)}% alcohol remains</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}