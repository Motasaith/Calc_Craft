'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function StampDutyCalculator() {
  const [price, setPrice] = useState('300000')
  const [rate, setRate] = useState('2')

  const p = parseFloat(price), r = parseFloat(rate)
  const valid = !isNaN(p) && !isNaN(r) && p > 0 && r >= 0
  const duty = valid ? (p * r) / 100 : 0
  const total = valid ? p + duty : 0

  return (
    <FormCalculatorShell title="Stamp Duty Calculator" subtitle="Duty = Price × Rate%" badge="REAL ESTATE">
      <RetroInput label="Property Price" value={price} onChange={setPrice} placeholder="300000" id="sd-p" unit="$" />
      <RetroInput label="Stamp Duty Rate" value={rate} onChange={setRate} placeholder="2" id="sd-r" unit="%" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Stamp Duty" value={`$${duty.toFixed(0)}`} large />
            <ResultDisplay label="Total Cost" value={`$${total.toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Cost Split</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="sdGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#sdGrid)" rx="8" />
              <path d={wobblyBar(20, 15, 120, 35)} fill="#a78bfa" fillOpacity="0.15" stroke="#7c3aed" strokeWidth="2" />
              <path d={wobblyBar(20, 15, (duty / total) * 120, 35)} fill="#fbbf24" fillOpacity="0.4" stroke="#d97706" strokeWidth="2" />
              <text x="80" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#d97706" fontWeight="bold">Duty: ${duty.toFixed(0)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}