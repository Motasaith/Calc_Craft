'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState('75000')
  const [rate, setRate] = useState('22')

  const inc = parseFloat(income), r = parseFloat(rate)
  const valid = !isNaN(inc) && !isNaN(r) && inc >= 0 && r >= 0
  const tax = valid ? (inc * r) / 100 : 0
  const netIncome = valid ? inc - tax : 0

  return (
    <FormCalculatorShell title="Income Tax Calculator" subtitle="Tax = Income × Rate%" badge="TAX">
      <RetroInput label="Annual Income" value={income} onChange={setIncome} placeholder="75000" id="it-i" unit="$" />
      <RetroInput label="Tax Rate" value={rate} onChange={setRate} placeholder="22" id="it-r" unit="%" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Tax Owed" value={`$${tax.toFixed(0)}`} large />
            <ResultDisplay label="Net Income" value={`$${netIncome.toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Income Split</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="itGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#itGrid)" rx="8" />
              <path d={wobblyBar(20, 15, 140, 35)} fill="#22c55e" fillOpacity="0.15" stroke="#16a34a" strokeWidth="2" />
              <path d={wobblyBar(20, 15, (tax / inc) * 140, 35)} fill="#ef4444" fillOpacity="0.4" stroke="#dc2626" strokeWidth="2" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">Tax: ${tax.toFixed(0)} ({r}%)</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}