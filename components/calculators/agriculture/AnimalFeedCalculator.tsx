'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function AnimalFeedCalculator() {
  const [weight, setWeight] = useState('500')
  const [pctBody, setPctBody] = useState('2.5')

  const w = parseFloat(weight), p = parseFloat(pctBody)
  const valid = !isNaN(w) && !isNaN(p) && w > 0 && p >= 0
  const feedPerDay = valid ? (w * p) / 100 : 0

  return (
    <FormCalculatorShell title="Animal Feed Calculator" subtitle="Feed = Weight × %Body" badge="AGRICULTURE">
      <RetroInput label="Animal Weight" value={weight} onChange={setWeight} placeholder="500" id="af-w" unit="kg" />
      <RetroInput label="% Body Weight" value={pctBody} onChange={setPctBody} placeholder="2.5" id="af-p" unit="%" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Daily Feed" value={feedPerDay.toFixed(2)} unit="kg/day" large />
            <ResultDisplay label="Monthly Feed" value={(feedPerDay * 30).toFixed(1)} unit="kg/mo" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Feed Ratio</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="afGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#afGrid)" rx="8" />
              {/* Animal weight bar */}
              <path d={wobblyBar(20, 20, 60, 40)} fill="#a78bfa" fillOpacity="0.2" stroke="#7c3aed" strokeWidth="2" />
              <text x="50" y="72" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#7c3aed">{w}kg</text>
              {/* Feed bar */}
              <path d={wobblyBar(90, 20 + 40 - (p / 5) * 40, 50, (p / 5) * 40)} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="2" />
              <text x="115" y="72" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#d97706">{feedPerDay.toFixed(1)}kg</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}