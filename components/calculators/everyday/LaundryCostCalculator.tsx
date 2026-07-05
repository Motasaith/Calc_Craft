'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function LaundryCostCalculator() {
  const [loads, setLoads] = useState('5')
  const [cost, setCost] = useState('3.50')
  const [result, setResult] = useState<{ monthly: number; yearly: number; weekly: number } | null>(null)

  const calculate = () => {
    const l = parseFloat(loads)
    const c = parseFloat(cost)
    if (isNaN(l) || isNaN(c) || l < 0 || c < 0) return
    const weekly = l * c
    const monthly = weekly * 4.33
    const yearly = weekly * 52
    setResult({ monthly, yearly, weekly })
  }

  return (
    <FormCalculatorShell title="Laundry Cost Calculator" subtitle="Estimate laundry expenses" badge="EVERYDAY">
      <RetroInput label="Loads per Week" value={loads} onChange={setLoads} id="laundry-loads" />
      <RetroInput label="Cost per Load" value={cost} onChange={setCost} unit="$" id="laundry-cost" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Cost</RetroActionButton></div>
      {result && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label="Monthly Cost" value={`$${result.monthly.toFixed(2)}`} large />
          <ResultDisplay label="Weekly Cost" value={`$${result.weekly.toFixed(2)}`} />
          <ResultDisplay label="Yearly Cost" value={`$${result.yearly.toFixed(2)}`} />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 40 - 15, 50, 15)} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <path d={wobblyBar(70, 40 - 25, 50, 25)} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
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