'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function WaterUsageCalculator() {
  const [showers, setShowers] = useState('2')
  const [showerMin, setShowerMin] = useState('10')
  const [flushes, setFlushes] = useState('5')
  const [loads, setLoads] = useState('1')

  const sh = parseFloat(showers), sm = parseFloat(showerMin), fl = parseFloat(flushes), ld = parseFloat(loads)
  const valid = !isNaN(sh) && !isNaN(sm) && !isNaN(fl) && !isNaN(ld)
  // Shower: 9 L/min, Flush: 6 L, Laundry: 60 L/load
  const showerWater = valid ? sh * sm * 9 : 0
  const flushWater = valid ? fl * 6 : 0
  const laundryWater = valid ? ld * 60 : 0
  const total = valid ? showerWater + flushWater + laundryWater : 0

  return (
    <FormCalculatorShell title="Water Usage" subtitle="Daily household consumption" badge="ENVIRONMENT">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Showers/day" value={showers} onChange={setShowers} placeholder="2" id="wu-sh" unit="" />
        <RetroInput label="Min/shower" value={showerMin} onChange={setShowerMin} placeholder="10" id="wu-sm" unit="min" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Flushes/day" value={flushes} onChange={setFlushes} placeholder="5" id="wu-fl" unit="" />
        <RetroInput label="Laundry loads" value={loads} onChange={setLoads} placeholder="1" id="wu-ld" unit="" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Daily Water Use" value={total.toFixed(0)} unit="L" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Usage Breakdown</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="wuGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#wuGrid)" rx="8" />
              <path d={wobblyBar(20, 40 - (showerWater / total) * 30, 45, (showerWater / total) * 30)} fill="#60a5fa" fillOpacity="0.4" stroke="#2563eb" strokeWidth="1.5" />
              <text x="42" y="55" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#2563eb">Shower</text>
              <path d={wobblyBar(70, 40 - (flushWater / total) * 30, 45, (flushWater / total) * 30)} fill="#22c55e" fillOpacity="0.4" stroke="#16a34a" strokeWidth="1.5" />
              <text x="92" y="55" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#16a34a">Flush</text>
              <path d={wobblyBar(120, 40 - (laundryWater / total) * 30, 45, (laundryWater / total) * 30)} fill="#a78bfa" fillOpacity="0.4" stroke="#7c3aed" strokeWidth="1.5" />
              <text x="142" y="55" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#7c3aed">Laundry</text>
              <text x="90" y="67" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#2563eb" fontWeight="bold">{total.toFixed(0)} L/day</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}