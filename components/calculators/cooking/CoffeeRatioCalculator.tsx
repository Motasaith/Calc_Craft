'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CoffeeRatioCalculator() {
  const [water, setWater] = useState('300')
  const [ratio, setRatio] = useState('16')

  const w = parseFloat(water), r = parseFloat(ratio)
  const valid = !isNaN(w) && !isNaN(r) && w > 0 && r > 0
  const coffee = valid ? w / r : 0

  return (
    <FormCalculatorShell title="Coffee Ratio" subtitle="Coffee = Water / Ratio" badge="COOKING">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Water" value={water} onChange={setWater} placeholder="300" id="cf-w" unit="g" />
        <RetroInput label="Ratio (1:X)" value={ratio} onChange={setRatio} placeholder="16" id="cf-r" unit="" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Coffee Needed" value={coffee.toFixed(1)} unit="g" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Coffee : Water</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="cfGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#cfGrid)" rx="8" />
              <path d={wobblyBar(25, 15, 40, Math.min(40, coffee * 2))} fill="#78350f" fillOpacity="0.4" stroke="#78350f" strokeWidth="2" />
              <text x="45" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#78350f">Coffee</text>
              <path d={wobblyBar(95, 15 + 40 - Math.min(40, w / 10), 40, Math.min(40, w / 10))} fill="#60a5fa" fillOpacity="0.3" stroke="#2563eb" strokeWidth="2" />
              <text x="115" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#2563eb">Water</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}