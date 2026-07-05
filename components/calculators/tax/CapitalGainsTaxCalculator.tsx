'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CapitalGainsTaxCalculator() {
  const [purchase, setPurchase] = useState('10000')
  const [sale, setSale] = useState('15000')
  const [rate, setRate] = useState('15')

  const p = parseFloat(purchase), s = parseFloat(sale), r = parseFloat(rate)
  const valid = !isNaN(p) && !isNaN(s) && !isNaN(r) && p >= 0 && s >= 0 && r >= 0
  const gain = valid ? s - p : 0
  const tax = valid ? Math.max(0, gain) * (r / 100) : 0
  const netGain = valid ? gain - tax : 0

  return (
    <FormCalculatorShell title="Capital Gains Tax" subtitle="Tax = Gain × Rate%" badge="TAX">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Purchase Price" value={purchase} onChange={setPurchase} placeholder="10000" id="cg-p" unit="$" />
        <RetroInput label="Sale Price" value={sale} onChange={setSale} placeholder="15000" id="cg-s" unit="$" />
      </div>
      <RetroInput label="Tax Rate" value={rate} onChange={setRate} placeholder="15" id="cg-r" unit="%" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Capital Gain" value={`$${gain.toFixed(0)}`} large />
            <ResultDisplay label="Tax Owed" value={`$${tax.toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Gain Breakdown</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="cgGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#cgGrid)" rx="8" />
              <path d={wobblyBar(20, 15, 140, 35)} fill="#22c55e" fillOpacity="0.15" stroke="#16a34a" strokeWidth="2" />
              <path d={wobblyBar(20, 15, (tax / Math.max(gain, 1)) * 140, 35)} fill="#ef4444" fillOpacity="0.4" stroke="#dc2626" strokeWidth="2" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">Tax: ${tax.toFixed(0)} on ${gain.toFixed(0)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}