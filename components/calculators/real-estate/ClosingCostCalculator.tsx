'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ClosingCostCalculator() {
  const [price, setPrice] = useState('300000')
  const [rate, setRate] = useState('3')

  const p = parseFloat(price), r = parseFloat(rate)
  const valid = !isNaN(p) && !isNaN(r) && p > 0 && r >= 0
  const closingCosts = valid ? (p * r) / 100 : 0
  const total = valid ? p + closingCosts : 0

  return (
    <FormCalculatorShell title="Closing Cost Calculator" subtitle="Costs = Price × Rate%" badge="REAL ESTATE">
      <RetroInput label="Home Price" value={price} onChange={setPrice} placeholder="300000" id="cc-p" unit="$" />
      <RetroInput label="Closing Cost Rate" value={rate} onChange={setRate} placeholder="3" id="cc-r" unit="%" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Closing Costs" value={`$${closingCosts.toFixed(0)}`} large />
            <ResultDisplay label="Total Cost" value={`$${total.toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Cost Breakdown</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="ccGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#ccGrid)" rx="8" />
              <path d={wobblyBar(20, 15, 120, 35)} fill="#a78bfa" fillOpacity="0.2" stroke="#7c3aed" strokeWidth="2" />
              <path d={wobblyBar(20, 15, (closingCosts / total) * 120, 35)} fill="#fbbf24" fillOpacity="0.4" stroke="#d97706" strokeWidth="2" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#d97706" fontWeight="bold">Closing: ${closingCosts.toFixed(0)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}