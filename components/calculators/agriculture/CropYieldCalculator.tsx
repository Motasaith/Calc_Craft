'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CropYieldCalculator() {
  const [area, setArea] = useState('10')
  const [yieldPerHa, setYieldPerHa] = useState('5000')

  const a = parseFloat(area), y = parseFloat(yieldPerHa)
  const valid = !isNaN(a) && !isNaN(y) && a > 0 && y >= 0
  const totalYield = valid ? a * y : 0

  return (
    <FormCalculatorShell title="Crop Yield Calculator" subtitle="Yield = Area × Rate" badge="AGRICULTURE">
      <RetroInput label="Planted Area" value={area} onChange={setArea} placeholder="10" id="cy-a" unit="ha" />
      <RetroInput label="Yield per ha" value={yieldPerHa} onChange={setYieldPerHa} placeholder="5000" id="cy-y" unit="kg/ha" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Total Yield" value={totalYield.toFixed(0)} unit="kg" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Crop Field</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="cyGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#cyGrid)" rx="8" />
              <path d={wobblyRect(20, 15, 120, 60)} fill="#84cc16" fillOpacity="0.2" stroke="#65a30d" strokeWidth="2" />
              {/* Crop rows */}
              {[25, 40, 55, 70].map((y2) => (
                <path key={y2} d={`M 25 ${y2} L 135 ${y2}`} stroke="#65a30d" strokeWidth="1" strokeDasharray="4 3" />
              ))}
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#65a30d" fontWeight="bold">{totalYield.toLocaleString()} kg</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}