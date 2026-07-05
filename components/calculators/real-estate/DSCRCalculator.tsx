'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function DSCRCalculator() {
  const [noi, setNoi] = useState('30000')
  const [debtService, setDebtService] = useState('24000')

  const n = parseFloat(noi), d = parseFloat(debtService)
  const valid = !isNaN(n) && !isNaN(d) && d > 0
  const dscr = valid ? n / d : 0
  const healthy = dscr >= 1.25

  return (
    <FormCalculatorShell title="DSCR Calculator" subtitle="DSCR = NOI / Debt Service" badge="REAL ESTATE">
      <RetroInput label="Annual NOI" value={noi} onChange={setNoi} placeholder="30000" id="ds-n" unit="$" />
      <RetroInput label="Annual Debt Service" value={debtService} onChange={setDebtService} placeholder="24000" id="ds-d" unit="$" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="DSCR" value={dscr.toFixed(2)} large />
          </div>
          <div className="mt-2 text-center">
            <span className={`text-[10px] font-bold font-mono uppercase ${healthy ? 'text-green-600' : 'text-red-600'}`}>
              {healthy ? '✓ Healthy (≥1.25)' : '⚠ Below threshold (<1.25)'}
            </span>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Coverage Ratio</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="dsGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#dsGrid)" rx="8" />
              <path d={wobblyBar(25, 15, 50, Math.min(40, n / 1000))} fill={healthy ? '#22c55e' : '#ef4444'} fillOpacity="0.3" stroke={healthy ? '#16a34a' : '#dc2626'} strokeWidth="2" />
              <text x="50" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill={healthy ? '#16a34a' : '#dc2626'}>NOI</text>
              <path d={wobblyBar(95, 15 + 40 - Math.min(40, d / 1000), 50, Math.min(40, d / 1000))} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" />
              <text x="120" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#7c3aed">Debt</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}