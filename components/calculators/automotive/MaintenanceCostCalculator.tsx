'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function MaintenanceCostCalculator() {
  const [yearly, setYearly] = useState('1200')
  const [years, setYears] = useState('5')

  const y = parseFloat(yearly), yr = parseFloat(years)
  const valid = !isNaN(y) && !isNaN(yr) && y >= 0 && yr > 0
  const total = valid ? y * yr : 0
  const monthly = valid ? y / 12 : 0

  return (
    <FormCalculatorShell title="Car Maintenance Cost" subtitle="Total = Yearly × Years" badge="AUTOMOTIVE">
      <RetroInput label="Yearly Maintenance" value={yearly} onChange={setYearly} placeholder="1200" id="mc-y" unit="$" />
      <RetroInput label="Years Owned" value={years} onChange={setYears} placeholder="5" id="mc-yr" unit="yr" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Total Cost" value={`$${total.toFixed(0)}`} large />
            <ResultDisplay label="Monthly Avg" value={`$${monthly.toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Cost Over Time</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="mcGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#mcGrid)" rx="8" />
              {/* Stacked bars per year */}
              {Array.from({ length: Math.min(8, yr) }).map((_, i) => (
                <path key={i} d={wobblyBar(20 + i * 18, 55 - Math.min(35, y / 50), 14, Math.min(35, y / 50))} fill="#f97316" fillOpacity="0.3" stroke="#ea580c" strokeWidth="1.5" />
              ))}
              <text x="90" y="68" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ea580c" fontWeight="bold">${total.toFixed(0)} over {yr}yr</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}