'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CashOnCashCalculator() {
  const [noi, setNoi] = useState('15000')
  const [cashInvested, setCashInvested] = useState('100000')

  const n = parseFloat(noi), c = parseFloat(cashInvested)
  const valid = !isNaN(n) && !isNaN(c) && c > 0
  const cocReturn = valid ? (n / c) * 100 : 0

  return (
    <FormCalculatorShell title="Cash-on-Cash Return" subtitle="CoC = NOI / Cash Invested" badge="REAL ESTATE">
      <RetroInput label="Annual NOI" value={noi} onChange={setNoi} placeholder="15000" id="coc-n" unit="$" />
      <RetroInput label="Cash Invested" value={cashInvested} onChange={setCashInvested} placeholder="100000" id="coc-c" unit="$" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Cash-on-Cash Return" value={cocReturn.toFixed(2)} unit="%" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Return Visual</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="cocGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#cocGrid)" rx="8" />
              <path d={wobblyBar(25, 15, 50, Math.min(40, n / 500))} fill="#22c55e" fillOpacity="0.3" stroke="#16a34a" strokeWidth="2" />
              <text x="50" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#16a34a">NOI</text>
              <path d={wobblyBar(95, 15 + 40 - Math.min(40, c / 3000), 50, Math.min(40, c / 3000))} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" />
              <text x="120" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#7c3aed">Invested</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}