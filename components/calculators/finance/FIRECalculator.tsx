'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function FIRECalculator() {
  const [expenses, setExpenses] = useState('40000')
  const [withdraw, setWithdraw] = useState('4')
  const [savings, setSavings] = useState('100000')
  const [monthly, setMonthly] = useState('2000')
  const [returnRate, setReturnRate] = useState('7')

  const e = parseFloat(expenses)
  const w = parseFloat(withdraw)
  const s = parseFloat(savings)
  const m = parseFloat(monthly)
  const r = parseFloat(returnRate)
  const valid = !isNaN(e) && !isNaN(w) && !isNaN(s) && !isNaN(m) && !isNaN(r) && e > 0 && w > 0

  let fireNumber = 0
  let years = 0
  if (valid) {
    fireNumber = e / (w / 100)
    const mr = r / 100 / 12
    let bal = s
    let months = 0
    while (bal < fireNumber && months < 1200) {
      bal = bal * (1 + mr) + m
      months++
    }
    years = months / 12
  }

  const barW = valid && fireNumber > 0 ? Math.min((s / fireNumber) * 160, 160) : 0

  return (
    <FormCalculatorShell
      title="FIRE Calculator"
      subtitle="Financial Independence Retire Early"
      badge="FINANCE"
    >
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Annual Expenses" value={expenses} onChange={setExpenses} placeholder="e.g. 40000" id="fi-e" unit="$" />
        <RetroInput label="Withdrawal Rate" value={withdraw} onChange={setWithdraw} placeholder="e.g. 4" id="fi-w" unit="%" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Current Savings" value={savings} onChange={setSavings} placeholder="e.g. 100000" id="fi-s" unit="$" />
        <RetroInput label="Monthly Contribution" value={monthly} onChange={setMonthly} placeholder="e.g. 2000" id="fi-m" unit="$" />
      </div>
      <RetroInput label="Expected Return" value={returnRate} onChange={setReturnRate} placeholder="e.g. 7" id="fi-r" unit="%" />

      {valid && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <ResultDisplay label="Years to FIRE" value={years >= 100 ? '100+' : years.toFixed(1)} large />
            <ResultDisplay label="FIRE Number" value={formatCurrency(fireNumber)} />
          </div>
          <ResultDisplay label="Progress" value={`${((s / fireNumber) * 100).toFixed(1)}%`} />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill="#dfaa44" stroke="#be8b32" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">0%</text>
            <text x="150" y="58" fontSize="8" fontFamily="monospace" fill="#555">FIRE</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}