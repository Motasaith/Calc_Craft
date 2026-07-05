'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function AmortizationScheduleCalculator() {
  const [amount, setAmount] = useState('200000')
  const [rate, setRate] = useState('6')
  const [term, setTerm] = useState('30')

  const a = parseFloat(amount)
  const r = parseFloat(rate)
  const t = parseFloat(term)
  const valid = !isNaN(a) && !isNaN(r) && !isNaN(t) && a > 0 && t > 0

  let monthly = 0
  let totalInterest = 0
  let totalPaid = 0
  if (valid) {
    const m = r / 100 / 12
    const n = t * 12
    if (m === 0) {
      monthly = a / n
    } else {
      monthly = a * m * Math.pow(1 + m, n) / (Math.pow(1 + m, n) - 1)
    }
    totalPaid = monthly * n
    totalInterest = totalPaid - a
  }

  const principalPct = valid ? a / totalPaid : 0
  const barW = valid ? Math.min(principalPct * 160, 160) : 0

  return (
    <FormCalculatorShell
      title="Amortization Schedule Calculator"
      subtitle="Monthly payment & total interest"
      badge="FINANCE"
    >
      <RetroInput label="Loan Amount" value={amount} onChange={setAmount} placeholder="e.g. 200000" id="am-amt" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Interest Rate" value={rate} onChange={setRate} placeholder="e.g. 6" id="am-rate" unit="%" />
        <RetroInput label="Term" value={term} onChange={setTerm} placeholder="e.g. 30" id="am-term" unit="yrs" />
      </div>

      {valid && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <ResultDisplay label="Monthly Payment" value={formatCurrency(monthly)} large />
            <ResultDisplay label="Total Interest" value={formatCurrency(totalInterest)} />
          </div>
          <ResultDisplay label="Total Paid" value={formatCurrency(totalPaid)} />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill="#dfaa44" stroke="#be8b32" strokeWidth="1.5" />
            <path d={wobblyBar(20 + barW, 15, 160 - barW, 30)} fill="#ab3232" stroke="#8a2828" strokeWidth="1.5" opacity="0.6" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">Principal</text>
            <text x="140" y="58" fontSize="8" fontFamily="monospace" fill="#555">Interest</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}