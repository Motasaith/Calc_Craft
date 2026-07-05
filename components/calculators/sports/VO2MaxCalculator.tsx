'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function VO2MaxCalculator() {
  const [distance, setDistance] = useState('1600')
  const [minutes, setMinutes] = useState('8')

  const d = parseFloat(distance), m = parseFloat(minutes)
  const valid = !isNaN(d) && !isNaN(m) && d > 0 && m > 0
  // Cooper test: VO2max = (22.351 × distance_m) - 11.288 (time in minutes)
  const vo2 = valid ? (22.351 * d) / m - 11.288 : 0

  return (
    <FormCalculatorShell title="VO2 Max Calculator" subtitle="Cooper 12-min run test" badge="SPORTS">
      <RetroInput label="Distance Run" value={distance} onChange={setDistance} placeholder="1600" id="vo-d" unit="m" />
      <RetroInput label="Time" value={minutes} onChange={setMinutes} placeholder="8" id="vo-m" unit="min" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="VO2 Max" value={vo2.toFixed(1)} unit="ml/kg/min" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Fitness Level</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="voGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#voGrid)" rx="8" />
              <path d={wobblyBar(15, 25, 150, 25)} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" rx="3" />
              <path d={wobblyBar(15, 25, Math.min(150, (vo2 / 80) * 150), 25)} fill={vo2 > 50 ? '#22c55e' : vo2 > 35 ? '#fbbf24' : '#ef4444'} fillOpacity="0.4" stroke={vo2 > 50 ? '#16a34a' : vo2 > 35 ? '#d97706' : '#dc2626'} strokeWidth="1.5" rx="3" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={vo2 > 50 ? '#16a34a' : vo2 > 35 ? '#d97706' : '#dc2626'} fontWeight="bold">VO2: {vo2.toFixed(0)} ml/kg/min</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}