'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function VATCalculator() {
  const [amount, setAmount] = useState('100')
  const [rate, setRate] = useState('20')

  const a = parseFloat(amount), r = parseFloat(rate)
  const valid = !isNaN(a) && !isNaN(r) && a >= 0 && r >= 0
  const vat = valid ? (a * r) / 100 : 0
  const total = valid ? a + vat : 0

  return (
    <FormCalculatorShell title="VAT Calculator" subtitle="VAT = Amount × Rate%" badge="TAX">
      <RetroInput label="Net Amount" value={amount} onChange={setAmount} placeholder="100" id="va-a" unit="$" />
      <RetroInput label="VAT Rate" value={rate} onChange={setRate} placeholder="20" id="va-r" unit="%" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="VAT Amount" value={`$${vat.toFixed(2)}`} large />
            <ResultDisplay label="Total (Gross)" value={`$${total.toFixed(2)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Amount Breakdown</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="vaGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#vaGrid)" rx="8" />
              <path d={wobblyBar(20, 15, 120, 35)} fill="#a78bfa" fillOpacity="0.15" stroke="#7c3aed" strokeWidth="2" />
              <path d={wobblyBar(20, 15, (vat / total) * 120, 35)} fill="#fbbf24" fillOpacity="0.4" stroke="#d97706" strokeWidth="2" />
              <text x="80" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#d97706" fontWeight="bold">VAT: ${vat.toFixed(2)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}