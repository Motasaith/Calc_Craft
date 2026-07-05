'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CostPerMileCalculator() {
  const [fuelCost, setFuelCost] = useState('1800')
  const [maintenance, setMaintenance] = useState('600')
  const [insurance, setInsurance] = useState('1200')
  const [depreciation, setDepreciation] = useState('3000')
  const [miles, setMiles] = useState('12000')

  const f = parseFloat(fuelCost), m = parseFloat(maintenance), i = parseFloat(insurance), d = parseFloat(depreciation), mi = parseFloat(miles)
  const valid = !isNaN(f) && !isNaN(m) && !isNaN(i) && !isNaN(d) && !isNaN(mi) && mi > 0
  const total = valid ? f + m + i + d : 0
  const perMile = valid ? total / mi : 0

  return (
    <FormCalculatorShell title="Cost Per Mile" subtitle="Total Cost / Miles Driven" badge="AUTOMOTIVE">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Fuel Cost" value={fuelCost} onChange={setFuelCost} placeholder="1800" id="cpm-f" unit="$" />
        <RetroInput label="Maintenance" value={maintenance} onChange={setMaintenance} placeholder="600" id="cpm-m" unit="$" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Insurance" value={insurance} onChange={setInsurance} placeholder="1200" id="cpm-i" unit="$" />
        <RetroInput label="Depreciation" value={depreciation} onChange={setDepreciation} placeholder="3000" id="cpm-d" unit="$" />
      </div>
      <RetroInput label="Miles/Year" value={miles} onChange={setMiles} placeholder="12000" id="cpm-mi" unit="mi" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Total Annual Cost" value={`$${total.toFixed(0)}`} large />
            <ResultDisplay label="Cost Per Mile" value={`$${perMile.toFixed(2)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Cost Breakdown</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="cpmGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#cpmGrid)" rx="8" />
              <path d={wobblyBar(15, 45 - (f / total) * 30, 35, (f / total) * 30)} fill="#f97316" fillOpacity="0.4" stroke="#ea580c" strokeWidth="1.5" />
              <text x="32" y="60" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#ea580c">Fuel</text>
              <path d={wobblyBar(55, 45 - (m / total) * 30, 35, (m / total) * 30)} fill="#fbbf24" fillOpacity="0.4" stroke="#d97706" strokeWidth="1.5" />
              <text x="72" y="60" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#d97706">Maint</text>
              <path d={wobblyBar(95, 45 - (i / total) * 30, 35, (i / total) * 30)} fill="#60a5fa" fillOpacity="0.4" stroke="#2563eb" strokeWidth="1.5" />
              <text x="112" y="60" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#2563eb">Ins</text>
              <path d={wobblyBar(135, 45 - (d / total) * 30, 35, (d / total) * 30)} fill="#a78bfa" fillOpacity="0.4" stroke="#7c3aed" strokeWidth="1.5" />
              <text x="152" y="60" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#7c3aed">Dep</text>
              <text x="90" y="68" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#ea580c" fontWeight="bold">${perMile.toFixed(2)}/mi</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}