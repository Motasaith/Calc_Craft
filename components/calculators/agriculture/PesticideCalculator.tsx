'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PesticideCalculator() {
  const [area, setArea] = useState('5')
  const [rate, setRate] = useState('2')
  const [conc, setConc] = useState('50')

  const a = parseFloat(area), r = parseFloat(rate), c = parseFloat(conc)
  const valid = !isNaN(a) && !isNaN(r) && !isNaN(c) && a > 0 && r >= 0 && c > 0
  const productNeeded = valid ? (a * r) / (c / 100) : 0 // liters

  return (
    <FormCalculatorShell title="Pesticide Calculator" subtitle="Amount = (Area × Rate) / Concentration" badge="AGRICULTURE">
      <RetroInput label="Area" value={area} onChange={setArea} placeholder="5" id="ps-a" unit="ha" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Rate" value={rate} onChange={setRate} placeholder="2" id="ps-r" unit="L/ha" />
        <RetroInput label="Concentration" value={conc} onChange={setConc} placeholder="50" id="ps-c" unit="%" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Product Needed" value={productNeeded.toFixed(2)} unit="L" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Spray Tank</span>
            <svg width="120" height="90" viewBox="0 0 120 90" className="select-none">
              <defs>
                <pattern id="psGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="120" height="90" fill="url(#psGrid)" rx="8" />
              <path d={wobblyBar(35, 15, 50, 55)} fill="none" stroke="#6b7280" strokeWidth="2.5" />
              <path d={wobblyBar(35, 15 + 55 - Math.min(55, productNeeded * 10), 50, Math.min(55, productNeeded * 10))} fill="#84cc16" fillOpacity="0.3" stroke="#65a30d" strokeWidth="1.5" />
              <text x="60" y="82" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#65a30d" fontWeight="bold">{productNeeded.toFixed(1)} L</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}