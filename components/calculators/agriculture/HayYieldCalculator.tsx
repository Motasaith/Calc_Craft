'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function HayYieldCalculator() {
  const [area, setArea] = useState('10')
  const [balesPerHa, setBalesPerHa] = useState('100')
  const [baleWeight, setBaleWeight] = useState('25')

  const a = parseFloat(area), bph = parseFloat(balesPerHa), bw = parseFloat(baleWeight)
  const valid = !isNaN(a) && !isNaN(bph) && !isNaN(bw) && a > 0 && bph >= 0 && bw > 0
  const totalBales = valid ? a * bph : 0
  const totalWeight = valid ? totalBales * bw : 0

  return (
    <FormCalculatorShell title="Hay Yield Calculator" subtitle="Bales = Area × Rate" badge="AGRICULTURE">
      <RetroInput label="Field Area" value={area} onChange={setArea} placeholder="10" id="hy-a" unit="ha" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Bales/ha" value={balesPerHa} onChange={setBalesPerHa} placeholder="100" id="hy-bph" unit="" />
        <RetroInput label="Bale Weight" value={baleWeight} onChange={setBaleWeight} placeholder="25" id="hy-bw" unit="kg" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Total Bales" value={totalBales.toFixed(0)} large />
            <ResultDisplay label="Total Weight" value={(totalWeight / 1000).toFixed(2)} unit="t" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Hay Bales</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="hyGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#hyGrid)" rx="8" />
              {[25, 55, 85, 115].map((x, i) => (
                <g key={i}>
                  <path d={wobblyBar(x, 25, 20, 30)} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="1.5" />
                  <path d={`M ${x + 2} 30 L ${x + 18} 30 M ${x + 2} 40 L ${x + 18} 40 M ${x + 2} 50 L ${x + 18} 50`} stroke="#d97706" strokeWidth="0.8" />
                </g>
              ))}
              <text x="80" y="72" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#d97706" fontWeight="bold">{totalBales.toFixed(0)} bales</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}