'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function EnergySavingsCalculator() {
  const [oldWatts, setOldWatts] = useState('60')
  const [newWatts, setNewWatts] = useState('10')
  const [hours, setHours] = useState('6')
  const [rate, setRate] = useState('0.15')

  const ow = parseFloat(oldWatts), nw = parseFloat(newWatts), h = parseFloat(hours), r = parseFloat(rate)
  const valid = !isNaN(ow) && !isNaN(nw) && !isNaN(h) && !isNaN(r) && ow >= 0 && nw >= 0 && h >= 0 && r >= 0
  const dailySavings = valid ? ((ow - nw) * h / 1000) * r : 0
  const yearlySavings = valid ? dailySavings * 365 : 0

  return (
    <FormCalculatorShell title="Energy Savings" subtitle="Savings = (W₁-W₂) × hrs × rate" badge="ENVIRONMENT">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Old Bulb (W)" value={oldWatts} onChange={setOldWatts} placeholder="60" id="es-ow" unit="W" />
        <RetroInput label="New Bulb (W)" value={newWatts} onChange={setNewWatts} placeholder="10" id="es-nw" unit="W" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Hours/day" value={hours} onChange={setHours} placeholder="6" id="es-h" unit="h" />
        <RetroInput label="Electricity Rate" value={rate} onChange={setRate} placeholder="0.15" id="es-r" unit="$/kWh" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Daily Savings" value={`$${dailySavings.toFixed(3)}`} large />
            <ResultDisplay label="Yearly Savings" value={`$${yearlySavings.toFixed(2)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Power Comparison</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="esGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#esGrid)" rx="8" />
              <path d={wobblyBar(25, 15, 40, Math.min(40, ow * 0.6))} fill="#f97316" fillOpacity="0.3" stroke="#ea580c" strokeWidth="2" />
              <text x="45" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#ea580c">Old {ow}W</text>
              <path d={wobblyBar(95, 15 + 40 - Math.min(40, nw * 0.6), 40, Math.min(40, nw * 0.6))} fill="#22c55e" fillOpacity="0.3" stroke="#16a34a" strokeWidth="2" />
              <text x="115" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#16a34a">New {nw}W</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}