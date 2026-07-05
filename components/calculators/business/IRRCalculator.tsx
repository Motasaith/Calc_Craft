'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(points: [number, number][]) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
}

export default function IRRCalculator() {
  const [initial, setInitial] = useState('10000')
  const [cashFlow, setCashFlow] = useState('2500')
  const [years, setYears] = useState('5')

  const inv = parseFloat(initial) || 0
  const cf = parseFloat(cashFlow) || 0
  const yr = parseInt(years) || 0
  const valid = inv > 0 && cf > 0 && yr > 0

  // Estimate IRR via bisection: solve inv = sum(cf/(1+r)^t)
  let lo = -0.99
  let hi = 10
  let irr = 0
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2
    let npv = -inv
    for (let t = 1; t <= yr; t++) npv += cf / Math.pow(1 + mid, t)
    if (npv > 0) lo = mid
    else hi = mid
    irr = mid
  }

  const pts: [number, number][] = []
  for (let i = 0; i <= 20; i++) {
    const r = -0.5 + (i / 20) * 1.5
    let npv = -inv
    for (let t = 1; t <= yr; t++) npv += cf / Math.pow(1 + r, t)
    const x = 10 + i * 9
    const y = 70 - Math.max(-30, Math.min(50, npv / inv * 30))
    pts.push([x, y])
  }

  return (
    <FormCalculatorShell
      title="IRR Calculator"
      subtitle="Estimate internal rate of return"
      badge="BUSINESS"
    >
      <div>
        <RetroInput label="Initial Investment" value={initial} onChange={setInitial} unit="$" />
        <RetroInput label="Annual Cash Flow" value={cashFlow} onChange={setCashFlow} unit="$" />
        <RetroInput label="Years" value={years} onChange={setYears} />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Approx. IRR" value={(irr * 100).toFixed(2)} unit="%" large />
        </div>
      )}

      {pts.length > 1 && (
        <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
          <path d={wobblyLine(pts)} fill="none" stroke="#dfaa44" strokeWidth="2" opacity="0.9" />
        </svg>
      )}
    </FormCalculatorShell>
  )
}