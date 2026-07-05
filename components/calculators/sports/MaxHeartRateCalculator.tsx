'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function MaxHeartRateCalculator() {
  const [age, setAge] = useState('30')

  const a = parseFloat(age)
  const valid = !isNaN(a) && a > 0
  const maxHR = valid ? 220 - a : 0
  const zone50 = valid ? maxHR * 0.5 : 0
  const zone70 = valid ? maxHR * 0.7 : 0
  const zone85 = valid ? maxHR * 0.85 : 0

  return (
    <FormCalculatorShell title="Max Heart Rate" subtitle="MHR = 220 - Age" badge="SPORTS">
      <RetroInput label="Age" value={age} onChange={setAge} placeholder="30" id="mh-a" unit="yr" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Max HR" value={maxHR.toFixed(0)} unit="bpm" large />
            <ResultDisplay label="Target Zone" value={`${zone70.toFixed(0)}-${zone85.toFixed(0)}`} unit="bpm" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">HR Zones</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="mhGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#mhGrid)" rx="8" />
              <path d={wobblyBar(15, 50, 30, 20)} fill="#22c55e" fillOpacity="0.3" stroke="#16a34a" strokeWidth="1.5" />
              <text x="30" y="75" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#16a34a">50%</text>
              <path d={wobblyBar(50, 40, 30, 30)} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="1.5" />
              <text x="65" y="75" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#d97706">70%</text>
              <path d={wobblyBar(85, 25, 30, 45)} fill="#ef4444" fillOpacity="0.3" stroke="#dc2626" strokeWidth="1.5" />
              <text x="100" y="75" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#dc2626">85%</text>
              <path d={wobblyBar(120, 15, 30, 55)} fill="#7c3aed" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="1.5" />
              <text x="135" y="75" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#7c3aed">Max</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}