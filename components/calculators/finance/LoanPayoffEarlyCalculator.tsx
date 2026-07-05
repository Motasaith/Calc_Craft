'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function LoanPayoffEarlyCalculator() {
  const [amount, setAmount] = useState('200000')
  const [rate, setRate] = useState('6')
  const [payment, setPayment] = useState('1199')
  const [extra, setExtra] = useState('200')

  const a = parseFloat(amount)
  const r = parseFloat(rate)
  const pmt = parseFloat(payment)
  const x = parseFloat(extra)
  const valid = !isNaN(a) && !isNaN(r) && !isNaN(pmt) && !isNaN(x) && a > 0 && pmt > 0 && x >= 0

  function monthsToPayoff(balance: number, monthly: number): number {
    const m = r / 100 / 12
    if (monthly <= balance * m) return Infinity
    let bal = balance
    let months = 0
    while (bal > 0 && months < 1200) {
      const interest = bal * m
      const principal = monthly - interest
      bal -= principal
      months++
    }
    return months
  }

  let normalMonths = 0
  let earlyMonths = 0
  let monthsSaved = 0
  let interestSaved = 0
  if (valid) {
    normalMonths = monthsToPayoff(a, pmt)
    earlyMonths = monthsToPayoff(a, pmt + x)
    monthsSaved = normalMonths - earlyMonths
    interestSaved = (normalMonths * pmt - a) - (earlyMonths * (pmt + x) - a)
  }

  const barW = valid && normalMonths > 0 ? Math.min((monthsSaved / normalMonths) * 160, 160) : 0

  return (
    <FormCalculatorShell
      title="Early Payoff Calculator"
      subtitle="Time & interest saved by extra payments"
      badge="FINANCE"
    >
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Loan Amount" value={amount} onChange={setAmount} placeholder="e.g. 200000" id="ep-amt" unit="$" />
        <RetroInput label="Interest Rate" value={rate} onChange={setRate} placeholder="e.g. 6" id="ep-rate" unit="%" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Monthly Payment" value={payment} onChange={setPayment} placeholder="e.g. 1199" id="ep-pmt" unit="$" />
        <RetroInput label="Extra Payment" value={extra} onChange={setExtra} placeholder="e.g. 200" id="ep-extra" unit="$" />
      </div>

      {valid && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <ResultDisplay label="Months Saved" value={isFinite(monthsSaved) ? `${monthsSaved} mo` : 'N/A'} large />
            <ResultDisplay label="Interest Saved" value={formatCurrency(Math.max(0, interestSaved))} />
          </div>
          <ResultDisplay label="New Payoff Time" value={isFinite(earlyMonths) ? `${Math.floor(earlyMonths / 12)}y ${earlyMonths % 12}m` : 'Never'} />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill="#5b8a72" stroke="#3f6a55" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">Time Saved</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}