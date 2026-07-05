'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function WaterIntakeSportsCalculator() {
  const [weight, setWeight] = useState('70')
  const [exerciseMin, setExerciseMin] = useState('45')

  const w = parseFloat(weight), e = parseFloat(exerciseMin)
  const valid = !isNaN(w) && !isNaN(e) && w > 0 && e >= 0
  // 35 ml per kg + 12 ml per minute of exercise
  const waterMl = valid ? w * 35 + e * 12 : 0
  const waterL = valid ? waterMl / 1000 : 0
  const glasses = valid ? Math.round(waterMl / 250) : 0

  return (
    <FormCalculatorShell title="Hydration Calculator" subtitle="Water = 35ml/kg + 12ml/min exercise" badge="SPORTS">
      <RetroInput label="Body Weight" value={weight} onChange={setWeight} placeholder="70" id="hy-w" unit="kg" />
      <RetroInput label="Exercise Time" value={exerciseMin} onChange={setExerciseMin} placeholder="45" id="hy-e" unit="min" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Water Needed" value={waterL.toFixed(2)} unit="L" large />
            <ResultDisplay label="Glasses (250ml)" value={glasses} unit="glasses" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Hydration Gauge</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="hyGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#hyGrid)" rx="8" />
              <path d={wobblyBar(60, 15, 40, 55)} fill="none" stroke="#60a5fa" strokeWidth="2" />
              <path d={wobblyBar(60, 15 + 55 - Math.min(55, waterL * 10), 40, Math.min(55, waterL * 10))} fill="#60a5fa" fillOpacity="0.3" stroke="#2563eb" strokeWidth="1.5" />
              <text x="80" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb" fontWeight="bold">{waterL.toFixed(1)}L needed</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}