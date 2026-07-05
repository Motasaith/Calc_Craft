'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(points: [number, number][]) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
}

export default function NPVCalculator() {
  const [initial, setInitial] = useState('10000')
  const [cashFlow, setCashFlow] = useState('3000')
  const [discount, setDiscount] = useState('10')
  const [years, setYears] = useState('5')

  const inv = parseFloat(initial) || 0
  const cf = parseFloat(cashFlow) || 0
  const dr = parseFloat(discount) || 0
  const yr = parseInt(years) || 0

  let npv = -inv
  const yearlyValues: number[] = []
  for (let t = 1; t <= yr; t++) {
    const pv = cf / Math.pow(1 + dr / 100, t)
    npv += pv
    yearlyValues.push(pv)
  }
  const valid = inv > 0 && cf > 0 && yr > 0

  const pts: [number, number][] = yearlyValues.map((v, i) => {
    const x = 20 + (i * 160) / Math.max(1, yr - 1 || 1)
    const y = 70 - Math.min(50, Math.max(0, v / inv * 50))
    return [x, y]
  })

  return (
    <FormCalculatorShell
      title="NPV Calculator"
      subtitle="Net Present Value of cash flows"
      badge="BUSINESS"
    >
      <div>
        <RetroInput label="Initial Investment" value={initial} onChange={setInitial} unit="$" />
        <RetroInput label="Annual Cash Flow" value={cashFlow} onChange={setCashFlow} unit="$" />
        <RetroInput label="Discount Rate" value={discount} onChange={setDiscount} unit="%" />
        <RetroInput label="Years" value={years} onChange={setYears} />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay
            label="Net Present Value"
            value={`${npv >= 0 ? '+' : ''}${npv.toFixed(2)}`}
            unit="$"
            large
          />
        </div>
      )}

      {pts.length > 1 && (
        <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
          <path d={wobblyLine(pts)} fill="none" stroke="#dfaa44" strokeWidth="2" opacity="0.9" />
          {pts.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="2" fill="#9ca8af" />
          ))}
        </svg>
      )}
    </FormCalculatorShell>
  )
}