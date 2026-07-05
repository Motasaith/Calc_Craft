'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function FatIntakeCalculator() {
  const [calories, setCalories] = useState('')
  const [fatPct, setFatPct] = useState('30')

  const c = parseFloat(calories), p = parseFloat(fatPct)
  const valid = !isNaN(c) && !isNaN(p) && c > 0 && p > 0 && p <= 100
  const fatGrams = valid ? (c * p / 100) / 9 : 0
  const fatCals = valid ? c * p / 100 : 0

  const barWidth = valid ? Math.min(fatGrams / 150, 1) * 180 : 0

  return (
    <FormCalculatorShell title="Fat Intake Calculator" subtitle="Daily fat needs" badge="HEALTH">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Daily Calories" value={calories} onChange={setCalories} placeholder="2000" id="fat-c" unit="kcal" min={500} max={10000} />
        <RetroInput label="Fat Percentage" value={fatPct} onChange={setFatPct} placeholder="30" id="fat-p" unit="%" min={5} max={60} />
      </div>

      {valid && (
        <>
          <div className="mt-2">
            <ResultDisplay label="Daily Fat" value={fatGrams.toFixed(1)} unit="g" large />
          </div>
          <div className="mt-2">
            <ResultDisplay label="Fat Calories" value={Math.round(fatCals)} unit="kcal" />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(10, 25, barWidth, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="8" fontFamily="monospace" fill="#555">0 g</text>
            <text x="155" y="18" fontSize="8" fontFamily="monospace" fill="#555">150 g</text>
          </svg>
          <p className="text-[9px] text-neutral-500 font-mono mt-2">9 kcal per gram of fat. Recommended: 20-35% of total calories.</p>
        </>
      )}
    </FormCalculatorShell>
  )
}