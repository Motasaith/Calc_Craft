'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ElectricityBillCalculator() {
  const [kwh, setKwh] = useState('600')
  const [rate, setRate] = useState('0.14')
  const [fixed, setFixed] = useState('12')
  const [result, setResult] = useState<{ bill: number; usage: number; yearly: number } | null>(null)

  const calculate = () => {
    const k = parseFloat(kwh)
    const r = parseFloat(rate)
    const f = parseFloat(fixed)
    if (isNaN(k) || isNaN(r) || isNaN(f) || k < 0 || r < 0) return
    const bill = k * r + f
    setResult({ bill, usage: k, yearly: bill * 12 })
  }

  return (
    <FormCalculatorShell title="Electricity Bill Calculator" subtitle="Estimate monthly electricity cost" badge="EVERYDAY">
      <RetroInput label="Monthly kWh" value={kwh} onChange={setKwh} unit="kWh" id="elec-kwh" />
      <RetroInput label="Rate per kWh" value={rate} onChange={setRate} unit="$/kWh" id="elec-rate" />
      <RetroInput label="Fixed Charges" value={fixed} onChange={setFixed} unit="$" id="elec-fixed" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Estimate Bill</RetroActionButton></div>
      {result && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label="Estimated Bill" value={`$${result.bill.toFixed(2)}`} unit="/mo" large />
          <ResultDisplay label="Yearly Cost" value={`$${result.yearly.toFixed(2)}`} />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 40 - Math.min(result.bill / 5, 35), 60, Math.min(result.bill / 5, 35))} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(90, 40 - Math.min(result.yearly / 60, 35), 60, Math.min(result.yearly / 60, 35))} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <text x="40" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Monthly</text>
            <text x="120" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Yearly</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}