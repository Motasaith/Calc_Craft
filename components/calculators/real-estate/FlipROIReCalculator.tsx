'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function FlipROIReCalculator() {
  const [purchase, setPurchase] = useState('200000')
  const [repairs, setRepairs] = useState('30000')
  const [sale, setSale] = useState('300000')

  const p = parseFloat(purchase), r = parseFloat(repairs), s = parseFloat(sale)
  const valid = !isNaN(p) && !isNaN(r) && !isNaN(s) && p > 0 && r >= 0 && s > 0
  const totalCost = valid ? p + r : 0
  const profit = valid ? s - totalCost : 0
  const roi = valid ? (profit / totalCost) * 100 : 0

  return (
    <FormCalculatorShell title="House Flip ROI" subtitle="ROI = (Sale - Cost) / Cost" badge="REAL ESTATE">
      <RetroInput label="Purchase Price" value={purchase} onChange={setPurchase} placeholder="200000" id="fl-p" unit="$" />
      <RetroInput label="Repair Costs" value={repairs} onChange={setRepairs} placeholder="30000" id="fl-r" unit="$" />
      <RetroInput label="Sale Price" value={sale} onChange={setSale} placeholder="300000" id="fl-s" unit="$" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Profit" value={`$${profit.toFixed(0)}`} large />
            <ResultDisplay label="ROI" value={roi.toFixed(2)} unit="%" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Flip Breakdown</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="flGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#flGrid)" rx="8" />
              <path d={wobblyBar(20, 15, 50, Math.min(40, p / 10000))} fill="#ef4444" fillOpacity="0.3" stroke="#dc2626" strokeWidth="2" />
              <text x="45" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#dc2626">Buy</text>
              <path d={wobblyBar(75, 15 + 40 - Math.min(40, r / 10000), 40, Math.min(40, r / 10000))} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="2" />
              <text x="95" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#d97706">Repairs</text>
              <path d={wobblyBar(125, 15 + 40 - Math.min(40, s / 10000), 40, Math.min(40, s / 10000))} fill="#22c55e" fillOpacity="0.3" stroke="#16a34a" strokeWidth="2" />
              <text x="145" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#16a34a">Sell</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}