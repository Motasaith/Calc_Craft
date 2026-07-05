'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function InsurancePremiumCalculator() {
  const [baseRate, setBaseRate] = useState('800')
  const [ageFactor, setAgeFactor] = useState('1.2')
  const [riskFactor, setRiskFactor] = useState('1.0')

  const b = parseFloat(baseRate), a = parseFloat(ageFactor), r = parseFloat(riskFactor)
  const valid = !isNaN(b) && !isNaN(a) && !isNaN(r) && b > 0 && a > 0 && r > 0
  const premium = valid ? b * a * r : 0
  const monthly = valid ? premium / 12 : 0

  return (
    <FormCalculatorShell title="Insurance Premium" subtitle="Premium = Base × Age × Risk" badge="AUTOMOTIVE">
      <RetroInput label="Base Rate" value={baseRate} onChange={setBaseRate} placeholder="800" id="ip-b" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Age Factor" value={ageFactor} onChange={setAgeFactor} placeholder="1.2" id="ip-a" unit="×" />
        <RetroInput label="Risk Factor" value={riskFactor} onChange={setRiskFactor} placeholder="1.0" id="ip-r" unit="×" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Annual Premium" value={`$${premium.toFixed(0)}`} large />
            <ResultDisplay label="Monthly" value={`$${monthly.toFixed(0)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Premium Factors</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="ipGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#ipGrid)" rx="8" />
              <path d={wobblyBar(20, 15, 40, Math.min(40, b / 30))} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" />
              <text x="40" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#7c3aed">Base</text>
              <path d={wobblyBar(70, 15 + 40 - Math.min(40, a * 20), 40, Math.min(40, a * 20))} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="2" />
              <text x="90" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#d97706">Age</text>
              <path d={wobblyBar(120, 15 + 40 - Math.min(40, r * 20), 40, Math.min(40, r * 20))} fill="#ef4444" fillOpacity="0.3" stroke="#dc2626" strokeWidth="2" />
              <text x="140" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#dc2626">Risk</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}