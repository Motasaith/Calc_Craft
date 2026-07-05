'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function FuelCostTripCalculator() {
  const [distance, setDistance] = useState('500')
  const [mpg, setMpg] = useState('25')
  const [gasPrice, setGasPrice] = useState('3.5')

  const d = parseFloat(distance), m = parseFloat(mpg), p = parseFloat(gasPrice)
  const valid = !isNaN(d) && !isNaN(m) && !isNaN(p) && d > 0 && m > 0 && p > 0
  const gallons = valid ? d / m : 0
  const cost = valid ? gallons * p : 0

  return (
    <FormCalculatorShell title="Trip Fuel Cost" subtitle="Cost = (Distance / MPG) × Price" badge="AUTOMOTIVE">
      <RetroInput label="Trip Distance" value={distance} onChange={setDistance} placeholder="500" id="fc-d" unit="mi" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="MPG" value={mpg} onChange={setMpg} placeholder="25" id="fc-m" unit="mpg" />
        <RetroInput label="Gas Price" value={gasPrice} onChange={setGasPrice} placeholder="3.5" id="fc-p" unit="$/gal" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Fuel Needed" value={gallons.toFixed(2)} unit="gal" large />
            <ResultDisplay label="Trip Cost" value={`$${cost.toFixed(2)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Trip Visual</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="fcGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#fcGrid)" rx="8" />
              {/* Road */}
              <path d="M 15 45 L 165 45" stroke="#6b7280" strokeWidth="2" />
              <path d="M 25 45 L 35 45 M 50 45 L 60 45 M 75 45 L 85 45 M 100 45 L 110 45 M 125 45 L 135 45 M 150 45 L 160 45" stroke="#fbbf24" strokeWidth="2" />
              {/* Car */}
              <rect x="20" y="32" width="25" height="13" fill="#3b82f6" stroke="#1e40af" strokeWidth="1.5" rx="3" />
              <circle cx="26" cy="46" r="3" fill="#1e1b4b" />
              <circle cx="39" cy="46" r="3" fill="#1e1b4b" />
              {/* Destination flag */}
              <path d="M 160 25 L 160 45" stroke="#dc2626" strokeWidth="2" />
              <path d="M 160 25 L 170 28 L 160 31" fill="#dc2626" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#1e40af" fontWeight="bold">${cost.toFixed(2)} for {d}mi</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}