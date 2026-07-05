'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`
}

export default function InventoryTurnoverCalculator() {
  const [cogs, setCogs] = useState('50000')
  const [avgInventory, setAvgInventory] = useState('10000')

  const co = parseFloat(cogs) || 0
  const ai = parseFloat(avgInventory) || 0
  const turnover = ai > 0 ? co / ai : 0
  const daysToSell = turnover > 0 ? 365 / turnover : 0
  const valid = co > 0 && ai > 0

  const circleR = Math.min(30, Math.max(5, turnover * 2))

  return (
    <FormCalculatorShell
      title="Inventory Turnover"
      subtitle="How fast inventory sells"
      badge="BUSINESS"
    >
      <div>
        <RetroInput label="COGS" value={cogs} onChange={setCogs} unit="$" />
        <RetroInput label="Average Inventory" value={avgInventory} onChange={setAvgInventory} unit="$" />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Turnover Ratio" value={turnover.toFixed(2)} unit="x" large />
          <ResultDisplay label="Days to Sell" value={daysToSell.toFixed(0)} unit="days" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <path d={wobblyCircle(100, 40, circleR)} fill="none" stroke="#dfaa44" strokeWidth="3" opacity="0.8" />
        <path d={wobblyCircle(100, 40, circleR * 0.6)} fill="none" stroke="#9ca8af" strokeWidth="2" opacity="0.6" />
        <text x="100" y="75" textAnchor="middle" className="fill-neutral-600" fontSize="8" fontFamily="monospace">TURNOVER</text>
      </svg>
    </FormCalculatorShell>
  )
}