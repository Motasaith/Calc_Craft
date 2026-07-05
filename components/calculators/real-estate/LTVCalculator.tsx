'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function LTVCalculator() {
  const [loan, setLoan] = useState('240000')
  const [value, setValue] = useState('300000')

  const l = parseFloat(loan), v = parseFloat(value)
  const valid = !isNaN(l) && !isNaN(v) && v > 0
  const ltv = valid ? (l / v) * 100 : 0
  const equity = valid ? v - l : 0
  const healthy = ltv <= 80

  return (
    <FormCalculatorShell title="Loan-to-Value Ratio" subtitle="LTV = Loan / Value × 100" badge="REAL ESTATE">
      <RetroInput label="Loan Amount" value={loan} onChange={setLoan} placeholder="240000" id="ltv-l" unit="$" />
      <RetroInput label="Property Value" value={value} onChange={setValue} placeholder="300000" id="ltv-v" unit="$" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="LTV Ratio" value={ltv.toFixed(2)} unit="%" large />
            <ResultDisplay label="Equity" value={`$${equity.toFixed(0)}`} large />
          </div>
          <div className="mt-2 text-center">
            <span className={`text-[10px] font-bold font-mono uppercase ${healthy ? 'text-green-600' : 'text-red-600'}`}>
              {healthy ? '✓ Good (≤80%)' : '⚠ High LTV (>80%) — PMI may be required'}
            </span>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Loan vs Value</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="ltvGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#ltvGrid)" rx="8" />
              <path d={wobblyBar(20, 15, 120, 35)} fill="#a78bfa" fillOpacity="0.15" stroke="#7c3aed" strokeWidth="2" />
              <path d={wobblyBar(20, 15, (ltv / 100) * 120, 35)} fill={healthy ? '#22c55e' : '#ef4444'} fillOpacity="0.4" stroke={healthy ? '#16a34a' : '#dc2626'} strokeWidth="2" />
              <text x="80" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={healthy ? '#16a34a' : '#dc2626'} fontWeight="bold">LTV: {ltv.toFixed(1)}%</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}