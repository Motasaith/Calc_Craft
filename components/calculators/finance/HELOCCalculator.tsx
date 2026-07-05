'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function HELOCCalculator() {
  const [homeValue, setHomeValue] = useState('400000')
  const [mortgage, setMortgage] = useState('250000')
  const [ltv, setLtv] = useState('80')

  const hv = parseFloat(homeValue)
  const mb = parseFloat(mortgage)
  const ltvV = parseFloat(ltv)
  const valid = !isNaN(hv) && !isNaN(mb) && !isNaN(ltvV) && hv > 0 && mb >= 0 && ltvV > 0 && ltvV <= 100

  const maxLine = valid ? hv * (ltvV / 100) - mb : 0
  const equity = valid ? hv - mb : 0
  const barW = valid && hv > 0 ? Math.min((maxLine / hv) * 160, 160) : 0

  return (
    <FormCalculatorShell
      title="HELOC Calculator"
      subtitle="Home Equity Line of Credit limit"
      badge="FINANCE"
    >
      <RetroInput label="Home Value" value={homeValue} onChange={setHomeValue} placeholder="e.g. 400000" id="hl-hv" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Mortgage Balance" value={mortgage} onChange={setMortgage} placeholder="e.g. 250000" id="hl-mb" unit="$" />
        <RetroInput label="Max LTV Ratio" value={ltv} onChange={setLtv} placeholder="e.g. 80" id="hl-ltv" unit="%" />
      </div>

      {valid && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <ResultDisplay label="Available Credit" value={formatCurrency(Math.max(0, maxLine))} large />
            <ResultDisplay label="Home Equity" value={formatCurrency(equity)} />
          </div>
          <ResultDisplay label="LTV Used" value={`${((mb / hv) * 100).toFixed(1)}%`} />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill="#5b8a72" stroke="#3f6a55" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">0</text>
            <text x="150" y="58" fontSize="8" fontFamily="monospace" fill="#555">Credit</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}