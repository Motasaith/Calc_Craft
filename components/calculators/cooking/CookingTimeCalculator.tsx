'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CookingTimeCalculator() {
  const [weight, setWeight] = useState('2')
  const [minutesPerKg, setMinutesPerKg] = useState('25')

  const w = parseFloat(weight), mpk = parseFloat(minutesPerKg)
  const valid = !isNaN(w) && !isNaN(mpk) && w > 0 && mpk > 0
  const cookTime = valid ? w * mpk + 20 : 0 // +20 min resting
  const hours = valid ? Math.floor(cookTime / 60) : 0
  const mins = valid ? Math.round(cookTime % 60) : 0

  return (
    <FormCalculatorShell title="Cooking Time" subtitle="Time = Weight × min/kg + rest" badge="COOKING">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Weight" value={weight} onChange={setWeight} placeholder="2" id="ct-w" unit="kg" />
        <RetroInput label="Min per kg" value={minutesPerKg} onChange={setMinutesPerKg} placeholder="25" id="ct-mpk" unit="min" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Total Time" value={`${hours}h ${mins}m`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Cooking Timeline</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="ctGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#ctGrid)" rx="8" />
              <path d={wobblyBar(15, 25, Math.min(150, (cookTime / 180) * 150), 25)} fill="#f97316" fillOpacity="0.3" stroke="#ea580c" strokeWidth="2" rx="3" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ea580c" fontWeight="bold">{hours}h {mins}m total</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}