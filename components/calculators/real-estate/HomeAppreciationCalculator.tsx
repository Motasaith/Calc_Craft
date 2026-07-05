'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function HomeAppreciationCalculator() {
  const [currentValue, setCurrentValue] = useState('300000')
  const [rate, setRate] = useState('3')
  const [years, setYears] = useState('10')

  const v = parseFloat(currentValue), r = parseFloat(rate), y = parseFloat(years)
  const valid = !isNaN(v) && !isNaN(r) && !isNaN(y) && v > 0 && y > 0
  const futureValue = valid ? v * Math.pow(1 + r / 100, y) : 0
  const gain = valid ? futureValue - v : 0

  return (
    <FormCalculatorShell title="Home Appreciation" subtitle="FV = PV × (1 + r)^n" badge="REAL ESTATE">
      <RetroInput label="Current Value" value={currentValue} onChange={setCurrentValue} placeholder="300000" id="ha-v" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Annual Rate" value={rate} onChange={setRate} placeholder="3" id="ha-r" unit="%" />
        <RetroInput label="Years" value={years} onChange={setYears} placeholder="10" id="ha-y" unit="yr" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Future Value" value={`$${futureValue.toFixed(0)}`} large />
            <ResultDisplay label="Total Gain" value={`$${gain.toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Growth Chart</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="haGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#haGrid)" rx="8" />
              <path d="M 25 70 L 25 15" stroke="#6b7280" strokeWidth="1.5" />
              <path d="M 25 70 L 165 70" stroke="#6b7280" strokeWidth="1.5" />
              {/* Growth curve */}
              {(() => {
                const steps = 20
                let path = `M 25 70`
                for (let i = 1; i <= steps; i++) {
                  const t = i / steps
                  const val = v * Math.pow(1 + r / 100, t * y)
                  const x = 25 + t * 140
                  const yPos = 70 - (val / futureValue) * 50
                  path += ` L ${x} ${yPos}`
                }
                return <path d={path} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
              })()}
              <text x="90" y="12" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#22c55e" fontWeight="bold">${futureValue.toFixed(0)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}