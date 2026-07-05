'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function EBITDACalculator() {
  const [revenue, setRevenue] = useState('100000')
  const [expenses, setExpenses] = useState('60000')

  const rev = parseFloat(revenue) || 0
  const exp = parseFloat(expenses) || 0
  const ebitda = rev - exp
  const valid = rev > 0

  const revW = Math.min(160, Math.max(10, rev / 1000))
  const expW = Math.min(160, Math.max(10, exp / 1000))
  const ebitdaW = Math.min(160, Math.max(0, ebitda / 1000))

  return (
    <FormCalculatorShell
      title="EBITDA Calculator"
      subtitle="Earnings before interest, tax, depr."
      badge="BUSINESS"
    >
      <div>
        <RetroInput label="Revenue" value={revenue} onChange={setRevenue} unit="$" />
        <RetroInput label="Expenses (excl. int/tax/depr)" value={expenses} onChange={setExpenses} unit="$" />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="EBITDA" value={ebitda.toFixed(2)} unit="$" large />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <path d={wobblyBar(20, 20, revW, 12)} fill="#5a8a5a" opacity="0.8" />
        <path d={wobblyBar(20, 38, expW, 12)} fill="#ab3232" opacity="0.8" />
        <path d={wobblyBar(20, 56, ebitdaW, 12)} fill="#dfaa44" opacity="0.9" />
        <text x="20" y="14" className="fill-neutral-600" fontSize="7" fontFamily="monospace">REV</text>
        <text x="20" y="34" className="fill-neutral-600" fontSize="7" fontFamily="monospace">EXP</text>
        <text x="20" y="78" className="fill-neutral-600" fontSize="7" fontFamily="monospace">EBITDA</text>
      </svg>
    </FormCalculatorShell>
  )
}