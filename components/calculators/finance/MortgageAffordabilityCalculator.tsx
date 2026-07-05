'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function MortgageAffordabilityCalculator() {
  const [income, setIncome] = useState('80000')
  const [down, setDown] = useState('50000')
  const [rate, setRate] = useState('6')
  const [term, setTerm] = useState('30')
  const [dti, setDti] = useState('28')

  const inc = parseFloat(income)
  const d = parseFloat(down)
  const r = parseFloat(rate)
  const t = parseFloat(term)
  const dtiV = parseFloat(dti)
  const valid = !isNaN(inc) && !isNaN(d) && !isNaN(r) && !isNaN(t) && !isNaN(dtiV) && inc > 0 && t > 0 && dtiV > 0

  let maxLoan = 0
  let maxPrice = 0
  let monthlyPayment = 0
  if (valid) {
    const maxMonthly = (inc / 12) * (dtiV / 100)
    monthlyPayment = maxMonthly
    const m = r / 100 / 12
    const n = t * 12
    if (m === 0) {
      maxLoan = maxMonthly * n
    } else {
      maxLoan = maxMonthly * (Math.pow(1 + m, n) - 1) / (m * Math.pow(1 + m, n))
    }
    maxPrice = maxLoan + d
  }

  const barW = valid ? Math.min((maxLoan / maxPrice) * 160, 160) : 0

  return (
    <FormCalculatorShell
      title="Mortgage Affordability Calculator"
      subtitle="How much house can you afford"
      badge="FINANCE"
    >
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Annual Income" value={income} onChange={setIncome} placeholder="e.g. 80000" id="ma-inc" unit="$" />
        <RetroInput label="Down Payment" value={down} onChange={setDown} placeholder="e.g. 50000" id="ma-d" unit="$" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <RetroInput label="Rate" value={rate} onChange={setRate} placeholder="e.g. 6" id="ma-r" unit="%" />
        <RetroInput label="Term" value={term} onChange={setTerm} placeholder="e.g. 30" id="ma-t" unit="yrs" />
        <RetroInput label="DTI" value={dti} onChange={setDti} placeholder="e.g. 28" id="ma-dti" unit="%" />
      </div>

      {valid && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <ResultDisplay label="Max Home Price" value={formatCurrency(maxPrice)} large />
            <ResultDisplay label="Max Loan" value={formatCurrency(maxLoan)} />
          </div>
          <ResultDisplay label="Monthly Payment" value={formatCurrency(monthlyPayment)} />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill="#dfaa44" stroke="#be8b32" strokeWidth="1.5" />
            <path d={wobblyBar(20 + barW, 15, 160 - barW, 30)} fill="#5b8a72" stroke="#3f6a55" strokeWidth="1.5" opacity="0.6" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">Loan</text>
            <text x="140" y="58" fontSize="8" fontFamily="monospace" fill="#555">Down</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}