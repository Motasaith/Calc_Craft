'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function TaxRefundCalculator() {
  const [withheld, setWithheld] = useState('18000')
  const [taxOwed, setTaxOwed] = useState('15000')

  const w = parseFloat(withheld), t = parseFloat(taxOwed)
  const valid = !isNaN(w) && !isNaN(t) && w >= 0 && t >= 0
  const refund = valid ? w - t : 0
  const isRefund = refund > 0

  return (
    <FormCalculatorShell title="Tax Refund Estimator" subtitle="Refund = Withheld - Tax Owed" badge="TAX">
      <RetroInput label="Tax Withheld" value={withheld} onChange={setWithheld} placeholder="18000" id="tr-w" unit="$" />
      <RetroInput label="Tax Owed" value={taxOwed} onChange={setTaxOwed} placeholder="15000" id="tr-t" unit="$" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label={isRefund ? 'Refund' : 'Amount Owed'} value={`$${Math.abs(refund).toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Withheld vs Owed</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="trGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#trGrid)" rx="8" />
              <path d={wobblyBar(25, 15, 50, Math.min(40, w / 500))} fill={isRefund ? '#22c55e' : '#ef4444'} fillOpacity="0.3" stroke={isRefund ? '#16a34a' : '#dc2626'} strokeWidth="2" />
              <text x="50" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill={isRefund ? '#16a34a' : '#dc2626'}>Withheld</text>
              <path d={wobblyBar(105, 15 + 40 - Math.min(40, t / 500), 50, Math.min(40, t / 500))} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" />
              <text x="130" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#7c3aed">Owed</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}