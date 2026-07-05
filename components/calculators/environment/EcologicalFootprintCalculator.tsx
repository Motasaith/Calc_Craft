'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function EcologicalFootprintCalculator() {
  const [diet, setDiet] = useState('2.5')
  const [transport, setTransport] = useState('1.5')
  const [housing, setHousing] = useState('1.0')

  const d = parseFloat(diet), t = parseFloat(transport), h = parseFloat(housing)
  const valid = !isNaN(d) && !isNaN(t) && !isNaN(h) && d >= 0 && t >= 0 && h >= 0
  const total = valid ? d + t + h : 0
  const earthsNeeded = valid ? total / 1.7 : 0 // global biocapacity per person

  return (
    <FormCalculatorShell title="Ecological Footprint" subtitle="Total hectares per person" badge="ENVIRONMENT">
      <RetroInput label="Diet (ha)" value={diet} onChange={setDiet} placeholder="2.5" id="ef-d" unit="ha" />
      <RetroInput label="Transport (ha)" value={transport} onChange={setTransport} placeholder="1.5" id="ef-t" unit="ha" />
      <RetroInput label="Housing (ha)" value={housing} onChange={setHousing} placeholder="1.0" id="ef-h" unit="ha" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Total Footprint" value={total.toFixed(2)} unit="ha" large />
            <ResultDisplay label="Earths Needed" value={earthsNeeded.toFixed(2)} unit="🌍" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Footprint Breakdown</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="efGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#efGrid)" rx="8" />
              <path d={wobblyBar(20, 40 - (d / total) * 30, 45, (d / total) * 30)} fill="#22c55e" fillOpacity="0.4" stroke="#16a34a" strokeWidth="1.5" />
              <text x="42" y="55" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#16a34a">Diet</text>
              <path d={wobblyBar(70, 40 - (t / total) * 30, 45, (t / total) * 30)} fill="#f97316" fillOpacity="0.4" stroke="#ea580c" strokeWidth="1.5" />
              <text x="92" y="55" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#ea580c">Transport</text>
              <path d={wobblyBar(120, 40 - (h / total) * 30, 45, (h / total) * 30)} fill="#60a5fa" fillOpacity="0.4" stroke="#2563eb" strokeWidth="1.5" />
              <text x="142" y="55" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#2563eb">Housing</text>
              <text x="90" y="67" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#16a34a" fontWeight="bold">{earthsNeeded.toFixed(1)} Earths</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}