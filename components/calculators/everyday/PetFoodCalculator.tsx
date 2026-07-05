'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PetFoodCalculator() {
  const [weight, setWeight] = useState('25')
  const [perKg, setPerKg] = useState('20')
  const [days, setDays] = useState('30')
  const [result, setResult] = useState<{ daily: number; monthly: number; yearly: number } | null>(null)

  const calculate = () => {
    const w = parseFloat(weight)
    const p = parseFloat(perKg)
    if (isNaN(w) || isNaN(p) || w <= 0 || p <= 0) return
    const daily = (w * p) / 1000
    const monthly = daily * 30
    const yearly = daily * 365
    setResult({ daily, monthly, yearly })
  }

  return (
    <FormCalculatorShell title="Pet Food Calculator" subtitle="Estimate pet food needs" badge="EVERYDAY">
      <RetroInput label="Pet Weight" value={weight} onChange={setWeight} unit="kg" id="pet-weight" />
      <RetroInput label="Food per kg Body Weight" value={perKg} onChange={setPerKg} unit="g/kg" id="pet-perkg" />
      <RetroInput label="Days" value={days} onChange={setDays} id="pet-days" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Food</RetroActionButton></div>
      {result && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label="Daily Food" value={`${result.daily.toFixed(2)} kg`} large />
          <ResultDisplay label="Monthly Food" value={`${result.monthly.toFixed(2)} kg`} />
          <ResultDisplay label="Yearly Food" value={`${result.yearly.toFixed(1)} kg`} />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 40 - 10, 50, 10)} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <path d={wobblyBar(70, 40 - 25, 50, 25)} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(130, 40 - 40, 50, 40)} fill="#dad6cd" stroke="#b0bdae" strokeWidth="2" />
            <text x="35" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Daily</text>
            <text x="95" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Mo</text>
            <text x="155" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Yr</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}