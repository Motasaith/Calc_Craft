'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function MarkupCalculator() {
  const [cost, setCost] = useState('100')
  const [markupPct, setMarkupPct] = useState('50')

  const c = parseFloat(cost) || 0
  const m = parseFloat(markupPct) || 0
  const profit = c * (m / 100)
  const sellingPrice = c + profit
  const valid = c > 0

  const costW = Math.min(120, Math.max(10, c / 5))
  const profitW = Math.min(120, Math.max(10, profit / 5))

  return (
    <FormCalculatorShell
      title="Markup Calculator"
      subtitle="Selling price from cost & markup %"
      badge="BUSINESS"
    >
      <div>
        <RetroInput label="Cost" value={cost} onChange={setCost} unit="$" />
        <RetroInput label="Markup %" value={markupPct} onChange={setMarkupPct} unit="%" />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Selling Price" value={sellingPrice.toFixed(2)} unit="$" large />
          <ResultDisplay label="Profit" value={profit.toFixed(2)} unit="$" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <path d={wobblyBar(20, 30, costW, 20)} fill="#9ca8af" opacity="0.8" />
        <path d={wobblyBar(20, 55, profitW, 15)} fill="#dfaa44" opacity="0.9" />
        <text x="20" y="22" className="fill-neutral-600" fontSize="8" fontFamily="monospace">COST</text>
        <text x="20" y="78" className="fill-neutral-600" fontSize="8" fontFamily="monospace">PROFIT</text>
      </svg>
    </FormCalculatorShell>
  )
}