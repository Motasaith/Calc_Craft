'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CarDepreciationCalculator() {
  const [price, setPrice] = useState('30000')
  const [years, setYears] = useState('5')
  const [rate, setRate] = useState('15')

  const p = parseFloat(price), y = parseFloat(years), r = parseFloat(rate)
  const valid = !isNaN(p) && !isNaN(y) && !isNaN(r) && p > 0 && y > 0 && r >= 0
  const value = valid ? p * Math.pow(1 - r / 100, y) : 0
  const lost = valid ? p - value : 0

  return (
    <FormCalculatorShell title="Car Depreciation" subtitle="V = Price × (1 - rate)^years" badge="AUTOMOTIVE">
      <RetroInput label="Purchase Price" value={price} onChange={setPrice} placeholder="30000" id="cd-p" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Years" value={years} onChange={setYears} placeholder="5" id="cd-y" unit="yr" />
        <RetroInput label="Depreciation Rate" value={rate} onChange={setRate} placeholder="15" id="cd-r" unit="%" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Current Value" value={`$${value.toFixed(0)}`} large />
            <ResultDisplay label="Value Lost" value={`$${lost.toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Value Over Time</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="cdGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#cdGrid)" rx="8" />
              <path d="M 25 70 L 25 15" stroke="#6b7280" strokeWidth="1.5" />
              <path d="M 25 70 L 165 70" stroke="#6b7280" strokeWidth="1.5" />
              {/* Depreciation curve */}
              {(() => {
                const steps = 20
                let path = `M 25 70`
                for (let i = 1; i <= steps; i++) {
                  const t = i / steps
                  const val = p * Math.pow(1 - r / 100, t * y)
                  const x = 25 + t * 140
                  const yPos = 70 - (val / p) * 50
                  path += ` L ${x} ${yPos}`
                }
                return <path d={path} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              })()}
              <text x="90" y="12" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ef4444" fontWeight="bold">${value.toFixed(0)} after {y}yr</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}