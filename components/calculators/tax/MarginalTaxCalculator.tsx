'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function MarginalTaxCalculator() {
  const [income, setIncome] = useState('100000')

  const inc = parseFloat(income)
  const valid = !isNaN(inc) && inc >= 0
  // Simplified US 2024 brackets (single filer)
  const brackets = [
    { min: 0, max: 11600, rate: 10 },
    { min: 11600, max: 47150, rate: 12 },
    { min: 47150, max: 100525, rate: 22 },
    { min: 100525, max: 191950, rate: 24 },
    { min: 191950, max: 243725, rate: 32 },
    { min: 243725, max: 609350, rate: 35 },
    { min: 609350, max: Infinity, rate: 37 },
  ]
  let tax = 0
  if (valid) {
    for (const b of brackets) {
      if (inc > b.min) {
        tax += (Math.min(inc, b.max) - b.min) * (b.rate / 100)
      }
    }
  }
  const effectiveRate = valid && inc > 0 ? (tax / inc) * 100 : 0

  return (
    <FormCalculatorShell title="Marginal Tax Brackets" subtitle="Progressive bracket calculation" badge="TAX">
      <RetroInput label="Annual Income" value={income} onChange={setIncome} placeholder="100000" id="mt-i" unit="$" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Total Tax" value={`$${tax.toFixed(0)}`} large />
            <ResultDisplay label="Effective Rate" value={effectiveRate.toFixed(2)} unit="%" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Tax Brackets</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="mtGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#mtGrid)" rx="8" />
              {/* Bracket bars */}
              {brackets.slice(0, 5).map((b, i) => (
                <path key={i} d={wobblyBar(15 + i * 33, 60 - b.rate, 30, b.rate)} fill="#ef4444" fillOpacity={0.2 + i * 0.1} stroke="#dc2626" strokeWidth="1.5" />
              ))}
              <text x="90" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">Tax: ${tax.toFixed(0)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}