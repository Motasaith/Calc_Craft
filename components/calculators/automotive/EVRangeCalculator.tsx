'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function EVRangeCalculator() {
  const [battery, setBattery] = useState('75')
  const [efficiency, setEfficiency] = useState('3.5')

  const b = parseFloat(battery), e = parseFloat(efficiency)
  const valid = !isNaN(b) && !isNaN(e) && b > 0 && e > 0
  const range = valid ? b * e : 0 // kWh × mi/kWh = miles

  return (
    <FormCalculatorShell title="EV Range Calculator" subtitle="Range = Battery × Efficiency" badge="AUTOMOTIVE">
      <RetroInput label="Battery Capacity" value={battery} onChange={setBattery} placeholder="75" id="evr-b" unit="kWh" />
      <RetroInput label="Efficiency" value={efficiency} onChange={setEfficiency} placeholder="3.5" id="evr-e" unit="mi/kWh" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Estimated Range" value={range.toFixed(0)} unit="miles" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Battery Range Bar</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="evrGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#evrGrid)" rx="8" />
              {/* Battery icon */}
              <path d={wobblyBar(20, 20, 130, 30)} fill="none" stroke="#16a34a" strokeWidth="2" />
              <path d={wobblyBar(150, 27, 5, 16)} fill="#16a34a" />
              <path d={wobblyBar(22, 22, Math.min(126, (range / 400) * 126), 26)} fill="#22c55e" fillOpacity="0.4" stroke="#16a34a" strokeWidth="1.5" />
              <text x="85" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#16a34a" fontWeight="bold">{range.toFixed(0)} miles range</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}