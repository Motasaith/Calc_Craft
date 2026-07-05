'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function NetWorthCalculator() {
  const [assets, setAssets] = useState('500000')
  const [liabilities, setLiabilities] = useState('200000')

  const a = parseFloat(assets)
  const l = parseFloat(liabilities)
  const valid = !isNaN(a) && !isNaN(l) && a >= 0 && l >= 0

  const netWorth = valid ? a - l : 0
  const ratio = valid && a > 0 ? netWorth / a : 0
  const barW = valid ? Math.min(Math.abs(ratio) * 160, 160) : 0

  return (
    <FormCalculatorShell
      title="Net Worth Calculator"
      subtitle="Assets minus liabilities"
      badge="FINANCE"
    >
      <RetroInput label="Total Assets" value={assets} onChange={setAssets} placeholder="e.g. 500000" id="nw-a" unit="$" />
      <RetroInput label="Total Liabilities" value={liabilities} onChange={setLiabilities} placeholder="e.g. 200000" id="nw-l" unit="$" />

      {valid && (
        <div className="mt-4 space-y-3">
          <ResultDisplay label="Net Worth" value={formatCurrency(netWorth)} large />
          <ResultDisplay label="Net Worth Ratio" value={`${(ratio * 100).toFixed(1)}%`} />
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill={netWorth >= 0 ? '#5b8a72' : '#ab3232'} stroke="#3f6a55" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">0%</text>
            <text x="160" y="58" fontSize="8" fontFamily="monospace" fill="#555">100%</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}