'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ChurnRateCalculator() {
  const [startCustomers, setStartCustomers] = useState('1000')
  const [lostCustomers, setLostCustomers] = useState('50')

  const start = parseFloat(startCustomers) || 0
  const lost = parseFloat(lostCustomers) || 0
  const churnRate = start > 0 ? (lost / start) * 100 : 0
  const retained = start - lost
  const valid = start > 0

  const lostW = Math.min(160, Math.max(2, (lost / Math.max(1, start)) * 160))
  const retainedW = 160 - lostW

  return (
    <FormCalculatorShell
      title="Churn Rate Calculator"
      subtitle="Customer churn percentage"
      badge="BUSINESS"
    >
      <div>
        <RetroInput label="Customers at Start" value={startCustomers} onChange={setStartCustomers} />
        <RetroInput label="Customers Lost" value={lostCustomers} onChange={setLostCustomers} />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Churn Rate" value={churnRate.toFixed(2)} unit="%" large />
          <ResultDisplay label="Retained" value={retained.toFixed(0)} unit="customers" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <path d={wobblyBar(20, 30, retainedW, 20)} fill="#5a8a5a" opacity="0.8" />
        <path d={wobblyBar(20 + retainedW, 30, lostW, 20)} fill="#ab3232" opacity="0.8" />
        <text x="20" y="22" className="fill-neutral-600" fontSize="8" fontFamily="monospace">RETAINED vs LOST</text>
      </svg>
    </FormCalculatorShell>
  )
}