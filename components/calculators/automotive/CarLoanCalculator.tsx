'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CarLoanCalculator() {
  const [price, setPrice] = useState('30000')
  const [down, setDown] = useState('5000')
  const [rate, setRate] = useState('5')
  const [months, setMonths] = useState('60')

  const p = parseFloat(price), d = parseFloat(down), r = parseFloat(rate), m = parseFloat(months)
  const valid = !isNaN(p) && !isNaN(d) && !isNaN(r) && !isNaN(m) && p > 0 && m > 0
  const principal = valid ? p - d : 0
  const monthlyRate = valid ? r / 100 / 12 : 0
  const monthlyPayment = valid && monthlyRate > 0
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, m)) / (Math.pow(1 + monthlyRate, m) - 1)
    : valid ? principal / m : 0
  const totalPaid = valid ? monthlyPayment * m : 0
  const totalInterest = valid ? totalPaid - principal : 0

  return (
    <FormCalculatorShell title="Car Loan Calculator" subtitle="Monthly payment + interest" badge="AUTOMOTIVE">
      <RetroInput label="Car Price" value={price} onChange={setPrice} placeholder="30000" id="cl-p" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Down Payment" value={down} onChange={setDown} placeholder="5000" id="cl-d" unit="$" />
        <RetroInput label="Interest Rate" value={rate} onChange={setRate} placeholder="5" id="cl-r" unit="%" />
      </div>
      <RetroInput label="Loan Term" value={months} onChange={setMonths} placeholder="60" id="cl-m" unit="months" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Monthly Payment" value={`$${monthlyPayment.toFixed(2)}`} large />
            <ResultDisplay label="Total Interest" value={`$${totalInterest.toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Loan Split</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="clGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#clGrid)" rx="8" />
              <path d={wobblyBar(20, 15, 120, 35)} fill="#3b82f6" fillOpacity="0.15" stroke="#1e40af" strokeWidth="2" />
              <path d={wobblyBar(20, 15, (totalInterest / totalPaid) * 120, 35)} fill="#fbbf24" fillOpacity="0.4" stroke="#d97706" strokeWidth="2" />
              <text x="80" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#d97706" fontWeight="bold">Interest: ${totalInterest.toFixed(0)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}