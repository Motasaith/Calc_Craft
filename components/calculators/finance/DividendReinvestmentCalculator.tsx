'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function DividendReinvestmentCalculator() {
  const [initial, setInitial] = useState('10000')
  const [yieldRate, setYieldRate] = useState('3')
  const [growth, setGrowth] = useState('5')
  const [years, setYears] = useState('20')

  const i = parseFloat(initial)
  const y = parseFloat(yieldRate)
  const g = parseFloat(growth)
  const n = parseFloat(years)
  const valid = !isNaN(i) && !isNaN(y) && !isNaN(g) && !isNaN(n) && i > 0 && n > 0

  let finalValue = 0
  let totalDividends = 0
  if (valid) {
    let value = i
    const yr = y / 100
    const gr = g / 100
    for (let k = 0; k < n; k++) {
      const dividend = value * yr
      totalDividends += dividend
      value += dividend
      value *= (1 + gr)
    }
    finalValue = value
  }

  const gain = valid ? finalValue - i : 0
  const barW = valid ? Math.min((finalValue / i) * 40, 140) : 0

  return (
    <FormCalculatorShell
      title="Dividend Reinvestment (DRIP)"
      subtitle="Project reinvested dividend growth"
      badge="FINANCE"
    >
      <RetroInput label="Initial Investment" value={initial} onChange={setInitial} placeholder="e.g. 10000" id="dr-i" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Dividend Yield" value={yieldRate} onChange={setYieldRate} placeholder="e.g. 3" id="dr-y" unit="%" />
        <RetroInput label="Price Growth Rate" value={growth} onChange={setGrowth} placeholder="e.g. 5" id="dr-g" unit="%" />
      </div>
      <RetroInput label="Years" value={years} onChange={setYears} placeholder="e.g. 20" id="dr-n" unit="yrs" />

      {valid && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <ResultDisplay label="Final Value" value={formatCurrency(finalValue)} large />
            <ResultDisplay label="Total Dividends" value={formatCurrency(totalDividends)} />
          </div>
          <ResultDisplay label="Total Gain" value={formatCurrency(gain)} />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill="#5b8a72" stroke="#3f6a55" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">Initial</text>
            <text x="150" y="58" fontSize="8" fontFamily="monospace" fill="#555">Final</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}