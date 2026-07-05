'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function EstateTaxCalculator() {
  const [estate, setEstate] = useState('5000000')
  const [exemption, setExemption] = useState('13610000')
  const [rate, setRate] = useState('40')

  const e = parseFloat(estate), ex = parseFloat(exemption), r = parseFloat(rate)
  const valid = !isNaN(e) && !isNaN(ex) && !isNaN(r) && e >= 0 && ex >= 0 && r >= 0
  const taxable = valid ? Math.max(0, e - ex) : 0
  const tax = valid ? (taxable * r) / 100 : 0

  return (
    <FormCalculatorShell title="Estate Tax Calculator" subtitle="Tax = (Estate - Exemption) × Rate" badge="TAX">
      <RetroInput label="Estate Value" value={estate} onChange={setEstate} placeholder="5000000" id="et-e" unit="$" />
      <RetroInput label="Exemption" value={exemption} onChange={setExemption} placeholder="13610000" id="et-ex" unit="$" />
      <RetroInput label="Tax Rate" value={rate} onChange={setRate} placeholder="40" id="et-r" unit="%" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Taxable Estate" value={`$${taxable.toFixed(0)}`} large />
            <ResultDisplay label="Estate Tax" value={`$${tax.toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Estate Breakdown</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="etGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#etGrid)" rx="8" />
              <path d={wobblyBar(20, 15, 140, 35)} fill="#a78bfa" fillOpacity="0.15" stroke="#7c3aed" strokeWidth="2" />
              <path d={wobblyBar(20, 15, (tax / Math.max(e, 1)) * 140, 35)} fill="#ef4444" fillOpacity="0.4" stroke="#dc2626" strokeWidth="2" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">Tax: ${tax.toFixed(0)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}