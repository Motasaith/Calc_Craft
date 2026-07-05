'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PropertyTaxCalculator() {
  const [value, setValue] = useState('300000')
  const [rate, setRate] = useState('1.2')

  const v = parseFloat(value), r = parseFloat(rate)
  const valid = !isNaN(v) && !isNaN(r) && v > 0 && r >= 0
  const annualTax = valid ? (v * r) / 100 : 0
  const monthlyTax = valid ? annualTax / 12 : 0

  return (
    <FormCalculatorShell title="Property Tax Calculator" subtitle="Tax = Value × Rate%" badge="REAL ESTATE">
      <RetroInput label="Property Value" value={value} onChange={setValue} placeholder="300000" id="pt-v" unit="$" />
      <RetroInput label="Tax Rate" value={rate} onChange={setRate} placeholder="1.2" id="pt-r" unit="%" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Annual Tax" value={`$${annualTax.toFixed(0)}`} large />
            <ResultDisplay label="Monthly Tax" value={`$${monthlyTax.toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Tax Burden</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="ptGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#ptGrid)" rx="8" />
              <path d={wobblyBar(20, 15, 120, 35)} fill="#a78bfa" fillOpacity="0.15" stroke="#7c3aed" strokeWidth="2" />
              <path d={wobblyBar(20, 15, (annualTax / v) * 120, 35)} fill="#ef4444" fillOpacity="0.4" stroke="#dc2626" strokeWidth="2" />
              <text x="80" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">${annualTax.toFixed(0)}/yr</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}