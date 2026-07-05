'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`
}

export default function LifetimeValueCalculator() {
  const [avgPurchase, setAvgPurchase] = useState('50')
  const [frequency, setFrequency] = useState('4')
  const [lifespan, setLifespan] = useState('5')
  const [margin, setMargin] = useState('30')

  const apv = parseFloat(avgPurchase) || 0
  const freq = parseFloat(frequency) || 0
  const life = parseFloat(lifespan) || 0
  const mg = parseFloat(margin) || 0

  const customerValue = apv * freq * life
  const ltv = customerValue * (mg / 100)
  const valid = apv > 0 && freq > 0 && life > 0

  const circleR = Math.min(35, Math.max(5, ltv / 20))

  return (
    <FormCalculatorShell
      title="Lifetime Value (LTV)"
      subtitle="Customer lifetime value"
      badge="BUSINESS"
    >
      <div>
        <RetroInput label="Avg Purchase Value" value={avgPurchase} onChange={setAvgPurchase} unit="$" />
        <RetroInput label="Purchase Frequency / yr" value={frequency} onChange={setFrequency} />
        <RetroInput label="Customer Lifespan (yrs)" value={lifespan} onChange={setLifespan} />
        <RetroInput label="Profit Margin" value={margin} onChange={setMargin} unit="%" />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Customer LTV" value={ltv.toFixed(2)} unit="$" large />
          <ResultDisplay label="Total Customer Value" value={customerValue.toFixed(2)} unit="$" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <path d={wobblyCircle(100, 40, circleR)} fill="none" stroke="#dfaa44" strokeWidth="3" opacity="0.8" />
        <path d={wobblyCircle(100, 40, circleR * 0.5)} fill="#dfaa44" opacity="0.3" />
        <text x="100" y="75" textAnchor="middle" className="fill-neutral-600" fontSize="8" fontFamily="monospace">LTV</text>
      </svg>
    </FormCalculatorShell>
  )
}