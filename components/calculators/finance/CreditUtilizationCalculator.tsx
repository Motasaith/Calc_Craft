'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatPercent } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CreditUtilizationCalculator() {
  const [balance, setBalance] = useState('3000')
  const [limit, setLimit] = useState('10000')

  const b = parseFloat(balance)
  const l = parseFloat(limit)
  const valid = !isNaN(b) && !isNaN(l) && l > 0 && b >= 0

  const utilization = valid ? b / l : 0
  const available = valid ? l - b : 0
  const barW = valid ? Math.min(utilization * 160, 160) : 0
  const healthy = utilization <= 0.3

  return (
    <FormCalculatorShell
      title="Credit Utilization Calculator"
      subtitle="Balance vs total credit limit"
      badge="FINANCE"
    >
      <RetroInput label="Total Balance" value={balance} onChange={setBalance} placeholder="e.g. 3000" id="cu-b" unit="$" />
      <RetroInput label="Total Credit Limit" value={limit} onChange={setLimit} placeholder="e.g. 10000" id="cu-l" unit="$" />

      {valid && (
        <div className="mt-4 space-y-3">
          <ResultDisplay label="Utilization Ratio" value={formatPercent(utilization)} large />
          <ResultDisplay label="Available Credit" value={`$${available.toFixed(2)}`} />
          <div className={`text-xs font-mono font-bold ${healthy ? 'text-green-700' : 'text-red-600'}`}>
            {healthy ? '✓ Healthy (≤30%)' : '⚠ High (>30%)'}
          </div>
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill={healthy ? '#5b8a72' : '#ab3232'} stroke="#3f6a55" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">0%</text>
            <text x="160" y="58" fontSize="8" fontFamily="monospace" fill="#555">100%</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}