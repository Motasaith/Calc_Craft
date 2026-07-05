'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function WaterHeaterSizeCalculator() {
  const [household, setHousehold] = useState('4')
  const [peakDemand, setPeakDemand] = useState('20')

  const hh = parseFloat(household), pd = parseFloat(peakDemand)
  const valid = !isNaN(hh) && !isNaN(pd) && hh > 0 && pd > 0
  // Estimate: peak hour demand per person ~ pd gallons
  // Recommended tank size = peak demand × household × 1.25 (recovery factor)
  const tankSize = valid ? pd * hh * 1.25 : 0

  return (
    <FormCalculatorShell title="Water Heater Size Calculator" subtitle="Tank = Peak × People × 1.25" badge="PLUMBING">
      <RetroInput label="Household Size" value={household} onChange={setHousehold} placeholder="4" id="wh-h" unit="people" />
      <RetroInput label="Peak Hour Demand" value={peakDemand} onChange={setPeakDemand} placeholder="20" id="wh-p" unit="gal/person" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <ResultDisplay label="Recommended Tank" value={tankSize.toFixed(0)} unit="gal" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Heater Tank</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="whGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#whGrid)" rx="8" />
              <path d={wobblyBar(55, 10, 50, 70)} fill="#cbd5e1" fillOpacity="0.3" stroke="#64748b" strokeWidth="2" />
              <path d={wobblyBar(57, 10 + 70 - Math.min(60, tankSize / 2), 46, Math.min(60, tankSize / 2))} fill="#f97316" fillOpacity="0.4" stroke="#ea580c" strokeWidth="1.5" />
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ea580c" fontWeight="bold">{tankSize.toFixed(0)} gal</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}