'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function GroceryBudgetCalculator() {
  const [size, setSize] = useState('4')
  const [weekly, setWeekly] = useState('75')
  const [result, setResult] = useState<{ monthly: number; yearly: number; weekly: number } | null>(null)

  const calculate = () => {
    const s = parseInt(size)
    const w = parseFloat(weekly)
    if (isNaN(s) || isNaN(w) || s <= 0 || w < 0) return
    const weeklyTotal = s * w
    const monthly = weeklyTotal * 4.33
    const yearly = weeklyTotal * 52
    setResult({ monthly, yearly, weekly: weeklyTotal })
  }

  return (
    <FormCalculatorShell title="Grocery Budget Calculator" subtitle="Plan household grocery spending" badge="EVERYDAY">
      <RetroInput label="Household Size" value={size} onChange={setSize} unit="people" id="grocery-size" />
      <RetroInput label="Weekly Budget / Person" value={weekly} onChange={setWeekly} unit="$" id="grocery-weekly" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Budget</RetroActionButton></div>
      {result && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label="Monthly Budget" value={`$${result.monthly.toFixed(2)}`} large />
          <ResultDisplay label="Weekly Total" value={`$${result.weekly.toFixed(2)}`} />
          <ResultDisplay label="Yearly Total" value={`$${result.yearly.toFixed(2)}`} />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 40 - 15, 50, 15)} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <path d={wobblyBar(70, 40 - 30, 50, 30)} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(130, 40 - 40, 50, 40)} fill="#dad6cd" stroke="#b0bdae" strokeWidth="2" />
            <text x="35" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Wk</text>
            <text x="95" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Mo</text>
            <text x="155" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Yr</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}