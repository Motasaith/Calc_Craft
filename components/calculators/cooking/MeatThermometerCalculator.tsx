'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function MeatThermometerCalculator() {
  const [temp, setTemp] = useState('165')
  const [meat, setMeat] = useState('chicken')

  const t = parseFloat(temp)
  const valid = !isNaN(t)
  const safeTemps: Record<string, number> = {
    'chicken': 165, 'turkey': 165, 'pork': 145, 'beef': 145, 'ground': 160, 'fish': 145, 'lamb': 145, 'veal': 145,
  }
  const safeTemp = safeTemps[meat] || 145
  const isSafe = valid && t >= safeTemp

  return (
    <FormCalculatorShell title="Meat Doneness" subtitle="Check safe internal temp" badge="COOKING">
      <RetroInput label="Internal Temp" value={temp} onChange={setTemp} placeholder="165" id="mt-t" unit="°F" />
      <RetroInput label="Meat Type" value={meat} onChange={setMeat} placeholder="chicken" id="mt-m" unit="" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Safe Temp" value={`${safeTemp}°F`} large />
            <ResultDisplay label="Status" value={isSafe ? '✓ Safe' : '⚠ Undercooked'} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Temperature Check</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="mtGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#mtGrid)" rx="8" />
              <path d={wobblyBar(15, 25, 150, 25)} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" rx="3" />
              <path d={wobblyBar(15, 25, Math.min(150, (t / 200) * 150), 25)} fill={isSafe ? '#22c55e' : '#ef4444'} fillOpacity="0.4" stroke={isSafe ? '#16a34a' : '#dc2626'} strokeWidth="1.5" rx="3" />
              <path d={`M ${15 + (safeTemp / 200) * 150} 20 L ${15 + (safeTemp / 200) * 150} 50`} stroke="#1e1b4b" strokeWidth="2" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={isSafe ? '#16a34a' : '#dc2626'} fontWeight="bold">{t}°F — {isSafe ? 'Safe' : 'Undercooked'}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}