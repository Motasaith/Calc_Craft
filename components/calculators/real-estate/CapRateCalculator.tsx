'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CapRateCalculator() {
  const [noi, setNoi] = useState('24000')
  const [value, setValue] = useState('300000')

  const n = parseFloat(noi), v = parseFloat(value)
  const valid = !isNaN(n) && !isNaN(v) && v > 0
  const capRate = valid ? (n / v) * 100 : 0

  return (
    <FormCalculatorShell title="Cap Rate Calculator" subtitle="Cap Rate = NOI / Value" badge="REAL ESTATE">
      <RetroInput label="Net Operating Income" value={noi} onChange={setNoi} placeholder="24000" id="cr-n" unit="$" />
      <RetroInput label="Property Value" value={value} onChange={setValue} placeholder="300000" id="cr-v" unit="$" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Cap Rate" value={capRate.toFixed(2)} unit="%" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">NOI vs Value</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="crGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#crGrid)" rx="8" />
              <path d={wobblyBar(25, 15, 50, Math.min(40, n / 1000))} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="2" />
              <text x="50" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#d97706">NOI</text>
              <path d={wobblyBar(105, 15 + 40 - Math.min(40, v / 10000), 50, Math.min(40, v / 10000))} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" />
              <text x="130" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#7c3aed">Value</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}