'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function EBITDACalculatorFinance() {
  const [revenue, setRevenue] = useState('500000')
  const [expenses, setExpenses] = useState('350000')

  const r = parseFloat(revenue)
  const e = parseFloat(expenses)
  const valid = !isNaN(r) && !isNaN(e) && r > 0 && e >= 0

  const ebitda = valid ? r - e : 0
  const margin = valid ? ebitda / r : 0
  const barW = valid ? Math.min(Math.abs(margin) * 200, 140) : 0

  return (
    <FormCalculatorShell
      title="EBITDA Calculator"
      subtitle="Earnings before interest, tax, depr. & amort."
      badge="FINANCE"
    >
      <RetroInput label="Total Revenue" value={revenue} onChange={setRevenue} placeholder="e.g. 500000" id="eb-rev" unit="$" />
      <RetroInput label="Operating Expenses (excl. ITDA)" value={expenses} onChange={setExpenses} placeholder="e.g. 350000" id="eb-exp" unit="$" />

      {valid && (
        <div className="mt-4 space-y-3">
          <ResultDisplay label="EBITDA" value={formatCurrency(ebitda)} large />
          <ResultDisplay label="EBITDA Margin" value={`${(margin * 100).toFixed(2)}%`} />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill="#5b8a72" stroke="#3f6a55" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">0%</text>
            <text x="160" y="58" fontSize="8" fontFamily="monospace" fill="#555">Margin</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}