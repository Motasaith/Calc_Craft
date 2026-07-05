'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function RentalYieldCalculator() {
  const [price, setPrice] = useState('300000')
  const [rent, setRent] = useState('2000')
  const [expenses, setExpenses] = useState('400')

  const p = parseFloat(price), r = parseFloat(rent), e = parseFloat(expenses)
  const valid = !isNaN(p) && !isNaN(r) && !isNaN(e) && p > 0 && r >= 0 && e >= 0
  const annualRent = valid ? r * 12 : 0
  const annualExpenses = valid ? e * 12 : 0
  const netIncome = valid ? annualRent - annualExpenses : 0
  const grossYield = valid ? (annualRent / p) * 100 : 0
  const netYield = valid ? (netIncome / p) * 100 : 0

  return (
    <FormCalculatorShell title="Rental Yield" subtitle="Yield = (Rent × 12) / Price" badge="REAL ESTATE">
      <RetroInput label="Property Price" value={price} onChange={setPrice} placeholder="300000" id="ry-p" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Monthly Rent" value={rent} onChange={setRent} placeholder="2000" id="ry-r" unit="$" />
        <RetroInput label="Monthly Expenses" value={expenses} onChange={setExpenses} placeholder="400" id="ry-e" unit="$" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Gross Yield" value={grossYield.toFixed(2)} unit="%" large />
            <ResultDisplay label="Net Yield" value={netYield.toFixed(2)} unit="%" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Income vs Expenses</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="ryGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#ryGrid)" rx="8" />
              <path d={wobblyBar(25, 15, 50, Math.min(40, annualRent / 300))} fill="#22c55e" fillOpacity="0.3" stroke="#16a34a" strokeWidth="2" />
              <text x="50" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#16a34a">Income</text>
              <path d={wobblyBar(105, 15 + 40 - Math.min(40, annualExpenses / 300), 50, Math.min(40, annualExpenses / 300))} fill="#ef4444" fillOpacity="0.3" stroke="#dc2626" strokeWidth="2" />
              <text x="130" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#dc2626">Expenses</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}