'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatPercent } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CompoundAnnualGrowthCalculator() {
  const [initial, setInitial] = useState('10000')
  const [final, setFinal] = useState('25000')
  const [years, setYears] = useState('5')

  const i = parseFloat(initial)
  const f = parseFloat(final)
  const n = parseFloat(years)
  const valid = !isNaN(i) && !isNaN(f) && !isNaN(n) && i > 0 && f > 0 && n > 0

  const cagr = valid ? Math.pow(f / i, 1 / n) - 1 : 0
  const multiple = valid ? f / i : 0
  const barW = valid ? Math.min(Math.abs(cagr) * 800, 140) : 0

  return (
    <FormCalculatorShell
      title="CAGR Calculator"
      subtitle="Compound Annual Growth Rate"
      badge="FINANCE"
    >
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Initial Value" value={initial} onChange={setInitial} placeholder="e.g. 10000" id="cg-i" unit="$" />
        <RetroInput label="Final Value" value={final} onChange={setFinal} placeholder="e.g. 25000" id="cg-f" unit="$" />
      </div>
      <RetroInput label="Number of Years" value={years} onChange={setYears} placeholder="e.g. 5" id="cg-n" unit="yrs" />

      {valid && (
        <div className="mt-4 space-y-3">
          <ResultDisplay label="CAGR" value={formatPercent(cagr)} large />
          <ResultDisplay label="Growth Multiple" value={`${multiple.toFixed(2)}x`} />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill="#dfaa44" stroke="#be8b32" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">0%</text>
            <text x="160" y="58" fontSize="8" fontFamily="monospace" fill="#555">CAGR</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}