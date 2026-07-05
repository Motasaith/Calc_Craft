'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function GrossMarginCalculator() {
  const [revenue, setRevenue] = useState('80000')
  const [cogs, setCogs] = useState('50000')

  const rev = parseFloat(revenue) || 0
  const co = parseFloat(cogs) || 0
  const grossProfit = rev - co
  const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0
  const valid = rev > 0

  const revW = Math.min(160, Math.max(10, rev / 1000))
  const cogsW = Math.min(160, Math.max(0, co / 1000))
  const profitW = Math.min(160, Math.max(0, grossProfit / 1000))

  return (
    <FormCalculatorShell
      title="Gross Margin Calculator"
      subtitle="Gross profit & margin from revenue"
      badge="BUSINESS"
    >
      <div>
        <RetroInput label="Revenue" value={revenue} onChange={setRevenue} unit="$" />
        <RetroInput label="COGS" value={cogs} onChange={setCogs} unit="$" />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Gross Profit" value={grossProfit.toFixed(2)} unit="$" large />
          <ResultDisplay label="Gross Margin" value={grossMargin.toFixed(2)} unit="%" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <path d={wobblyBar(20, 20, revW, 12)} fill="#9ca8af" opacity="0.8" />
        <path d={wobblyBar(20, 38, cogsW, 12)} fill="#ab3232" opacity="0.8" />
        <path d={wobblyBar(20, 56, profitW, 12)} fill="#5a8a5a" opacity="0.9" />
        <text x="20" y="14" className="fill-neutral-600" fontSize="7" fontFamily="monospace">REV</text>
        <text x="20" y="34" className="fill-neutral-600" fontSize="7" fontFamily="monospace">COGS</text>
        <text x="20" y="78" className="fill-neutral-600" fontSize="7" fontFamily="monospace">PROFIT</text>
      </svg>
    </FormCalculatorShell>
  )
}