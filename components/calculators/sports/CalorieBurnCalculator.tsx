'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CalorieBurnCalculator() {
  const [weight, setWeight] = useState('70')
  const [met, setMet] = useState('8')
  const [minutes, setMinutes] = useState('30')

  const w = parseFloat(weight), m = parseFloat(met), min = parseFloat(minutes)
  const valid = !isNaN(w) && !isNaN(m) && !isNaN(min) && w > 0 && m > 0 && min > 0
  // Calories = MET × weight(kg) × time(hours)
  const calories = valid ? m * w * (min / 60) : 0

  return (
    <FormCalculatorShell title="Calorie Burn Calculator" subtitle="kcal = MET × kg × hours" badge="SPORTS">
      <RetroInput label="Body Weight" value={weight} onChange={setWeight} placeholder="70" id="cb-w" unit="kg" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="MET Value" value={met} onChange={setMet} placeholder="8" id="cb-m" unit="" />
        <RetroInput label="Duration" value={minutes} onChange={setMinutes} placeholder="30" id="cb-min" unit="min" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Calories Burned" value={calories.toFixed(0)} unit="kcal" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Energy Burned</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="cbGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#cbGrid)" rx="8" />
              <path d={wobblyBar(30, 60 - Math.min(45, calories / 10), 40, Math.min(45, calories / 10))} fill="#f97316" fillOpacity="0.3" stroke="#ea580c" strokeWidth="2" />
              <path d={wobblyBar(90, 60 - Math.min(45, calories / 15), 40, Math.min(45, calories / 15))} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="2" />
              <text x="80" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ea580c" fontWeight="bold">{calories.toFixed(0)} kcal</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}