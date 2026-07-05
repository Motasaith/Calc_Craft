'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PropertyTaxDeductionCalculator() {
  const [propertyTax, setPropertyTax] = useState('5000')
  const [mortgage, setMortgage] = useState('8000')
  const [rate, setRate] = useState('24')

  const pt = parseFloat(propertyTax), m = parseFloat(mortgage), r = parseFloat(rate)
  const valid = !isNaN(pt) && !isNaN(m) && !isNaN(r) && pt >= 0 && m >= 0 && r >= 0
  const totalDeduction = valid ? pt + m : 0
  const taxSavings = valid ? (totalDeduction * r) / 100 : 0

  return (
    <FormCalculatorShell title="Property Tax Deduction" subtitle="Savings = (PropTax + Mortgage) × Rate" badge="TAX">
      <RetroInput label="Property Tax Paid" value={propertyTax} onChange={setPropertyTax} placeholder="5000" id="pd-pt" unit="$" />
      <RetroInput label="Mortgage Interest" value={mortgage} onChange={setMortgage} placeholder="8000" id="pd-m" unit="$" />
      <RetroInput label="Tax Rate" value={rate} onChange={setRate} placeholder="24" id="pd-r" unit="%" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Total Deduction" value={`$${totalDeduction.toFixed(0)}`} large />
            <ResultDisplay label="Tax Savings" value={`$${taxSavings.toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Deduction Sources</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="pdGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#pdGrid)" rx="8" />
              <path d={wobblyBar(25, 15, 50, Math.min(40, pt / 250))} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="2" />
              <text x="50" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#d97706">PropTax</text>
              <path d={wobblyBar(95, 15 + 40 - Math.min(40, m / 250), 50, Math.min(40, m / 250))} fill="#60a5fa" fillOpacity="0.3" stroke="#2563eb" strokeWidth="2" />
              <text x="120" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#2563eb">Mortgage</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}