'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatPercent } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function DividendYieldCalculator() {
  const [dividend, setDividend] = useState('2.50')
  const [price, setPrice] = useState('50')

  const d = parseFloat(dividend)
  const p = parseFloat(price)
  const valid = !isNaN(d) && !isNaN(p) && p > 0 && d >= 0

  const yieldPct = valid ? d / p : 0
  const annualIncome = valid ? d * 100 : 0 // per 100 shares
  const barW = valid ? Math.min(yieldPct * 600, 140) : 0

  return (
    <FormCalculatorShell
      title="Dividend Yield Calculator"
      subtitle="Annual dividend vs share price"
      badge="FINANCE"
    >
      <RetroInput label="Annual Dividend / Share" value={dividend} onChange={setDividend} placeholder="e.g. 2.50" id="dy-div" unit="$" />
      <RetroInput label="Share Price" value={price} onChange={setPrice} placeholder="e.g. 50" id="dy-price" unit="$" />

      {valid && (
        <div className="mt-4 space-y-3">
          <ResultDisplay label="Dividend Yield" value={formatPercent(yieldPct)} large />
          <ResultDisplay label="Income / 100 Shares" value={`$${annualIncome.toFixed(2)}`} />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill="#5b8a72" stroke="#3f6a55" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">0%</text>
            <text x="160" y="58" fontSize="8" fontFamily="monospace" fill="#555">Yield</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}