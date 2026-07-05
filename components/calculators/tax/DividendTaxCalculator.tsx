'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function DividendTaxCalculator() {
  const [dividends, setDividends] = useState('5000')
  const [rate, setRate] = useState('15')

  const d = parseFloat(dividends), r = parseFloat(rate)
  const valid = !isNaN(d) && !isNaN(r) && d >= 0 && r >= 0
  const tax = valid ? (d * r) / 100 : 0
  const netDiv = valid ? d - tax : 0

  return (
    <FormCalculatorShell title="Dividend Tax" subtitle="Tax = Dividends × Rate%" badge="TAX">
      <RetroInput label="Dividend Income" value={dividends} onChange={setDividends} placeholder="5000" id="dv-d" unit="$" />
      <RetroInput label="Tax Rate" value={rate} onChange={setRate} placeholder="15" id="dv-r" unit="%" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Tax Owed" value={`$${tax.toFixed(0)}`} large />
            <ResultDisplay label="Net Dividends" value={`$${netDiv.toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Dividend Split</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="dvGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#dvGrid)" rx="8" />
              <path d={wobblyBar(20, 15, 120, 35)} fill="#22c55e" fillOpacity="0.15" stroke="#16a34a" strokeWidth="2" />
              <path d={wobblyBar(20, 15, (tax / d) * 120, 35)} fill="#ef4444" fillOpacity="0.4" stroke="#dc2626" strokeWidth="2" />
              <text x="80" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">Tax: ${tax.toFixed(0)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}