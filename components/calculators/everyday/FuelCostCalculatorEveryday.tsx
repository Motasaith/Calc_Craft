'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function FuelCostCalculatorEveryday() {
  const [distance, setDistance] = useState('40')
  const [mpg, setMpg] = useState('28')
  const [gasPrice, setGasPrice] = useState('3.50')
  const [days, setDays] = useState('5')
  const [result, setResult] = useState<{ weekly: number; monthly: number; yearly: number } | null>(null)

  const calculate = () => {
    const d = parseFloat(distance)
    const m = parseFloat(mpg)
    const g = parseFloat(gasPrice)
    const dy = parseInt(days)
    if (isNaN(d) || isNaN(m) || isNaN(g) || isNaN(dy) || m <= 0 || dy <= 0) return
    const dailyCost = (d / m) * g
    const weekly = dailyCost * dy
    const monthly = weekly * 4.33
    const yearly = weekly * 52
    setResult({ weekly, monthly, yearly })
  }

  return (
    <FormCalculatorShell title="Fuel Cost Calculator" subtitle="Estimate commute fuel costs" badge="EVERYDAY">
      <RetroInput label="Daily Distance" value={distance} onChange={setDistance} unit="mi" id="fuel-dist" />
      <RetroInput label="MPG" value={mpg} onChange={setMpg} unit="mpg" id="fuel-mpg" />
      <RetroInput label="Gas Price" value={gasPrice} onChange={setGasPrice} unit="$/gal" id="fuel-price" />
      <RetroInput label="Days per Week" value={days} onChange={setDays} id="fuel-days" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label="Weekly Cost" value={`$${result.weekly.toFixed(2)}`} large />
          <ResultDisplay label="Monthly Cost" value={`$${result.monthly.toFixed(2)}`} />
          <ResultDisplay label="Yearly Cost" value={`$${result.yearly.toFixed(2)}`} />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 40 - 10, 40, 10)} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <path d={wobblyBar(60, 40 - 25, 40, 25)} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(110, 40 - 40, 40, 40)} fill="#dad6cd" stroke="#b0bdae" strokeWidth="2" />
            <text x="30" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Wk</text>
            <text x="80" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Mo</text>
            <text x="130" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Yr</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}