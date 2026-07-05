'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function SepticTankCalculator() {
  const [bedrooms, setBedrooms] = useState('3')
  const [dailyUsage, setDailyUsage] = useState('150')

  const br = parseFloat(bedrooms), du = parseFloat(dailyUsage)
  const valid = !isNaN(br) && !isNaN(du) && br > 0 && du > 0
  // Estimate: people = bedrooms × 2; tank size = people × daily usage × 2 (days retention)
  const people = valid ? br * 2 : 0
  const tankSize = valid ? people * du * 2 : 0

  return (
    <FormCalculatorShell title="Septic Tank Calculator" subtitle="Tank = (BR×2) × Usage × 2 days" badge="PLUMBING">
      <RetroInput label="Bedrooms" value={bedrooms} onChange={setBedrooms} placeholder="3" id="st-b" unit="rooms" />
      <RetroInput label="Daily Water Usage" value={dailyUsage} onChange={setDailyUsage} placeholder="150" id="st-u" unit="gal/person" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Tank Size" value={tankSize.toFixed(0)} unit="gal" large />
            <ResultDisplay label="Capacity" value={people.toFixed(0)} unit="people" />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Septic Tank</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="stGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#stGrid)" rx="8" />
              <path d={wobblyBar(25, 20, 110, 50)} fill="#cbd5e1" fillOpacity="0.3" stroke="#64748b" strokeWidth="2" />
              <path d={wobblyBar(27, 20 + 50 - Math.min(40, tankSize / 30), 106, Math.min(40, tankSize / 30))} fill="#84cc16" fillOpacity="0.4" stroke="#65a30d" strokeWidth="1.5" />
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#65a30d" fontWeight="bold">{tankSize.toFixed(0)} gal</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}