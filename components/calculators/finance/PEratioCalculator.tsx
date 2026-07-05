'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatNumber } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PEratioCalculator() {
  const [price, setPrice] = useState('100')
  const [eps, setEps] = useState('5')

  const p = parseFloat(price)
  const e = parseFloat(eps)
  const valid = !isNaN(p) && !isNaN(e) && p > 0 && e > 0

  const ratio = valid ? p / e : 0
  const earningsYield = valid ? e / p : 0
  const barW = valid ? Math.min(ratio * 3, 140) : 0

  return (
    <FormCalculatorShell
      title="P/E Ratio Calculator"
      subtitle="Price-to-Earnings valuation"
      badge="FINANCE"
    >
      <RetroInput label="Share Price" value={price} onChange={setPrice} placeholder="e.g. 100" id="pe-price" unit="$" />
      <RetroInput label="Earnings Per Share (EPS)" value={eps} onChange={setEps} placeholder="e.g. 5" id="pe-eps" unit="$" />

      {valid && (
        <div className="mt-4 space-y-3">
          <ResultDisplay label="P/E Ratio" value={formatNumber(ratio, 2)} large />
          <ResultDisplay label="Earnings Yield" value={`${(earningsYield * 100).toFixed(2)}%`} />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill="#dfaa44" stroke="#be8b32" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">0</text>
            <text x="160" y="58" fontSize="8" fontFamily="monospace" fill="#555">P/E</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}