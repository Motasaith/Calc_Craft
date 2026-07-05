'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CommuteCostCalculator() {
  const [distance, setDistance] = useState('30')
  const [mpg, setMpg] = useState('28')
  const [gasPrice, setGasPrice] = useState('3.50')
  const [transit, setTransit] = useState('5')
  const [days, setDays] = useState('5')
  const [result, setResult] = useState<{ driving: number; transitCost: number; savings: number; cheaper: string } | null>(null)

  const calculate = () => {
    const d = parseFloat(distance)
    const m = parseFloat(mpg)
    const g = parseFloat(gasPrice)
    const t = parseFloat(transit)
    const dy = parseInt(days)
    if (isNaN(d) || isNaN(m) || isNaN(g) || isNaN(t) || isNaN(dy) || m <= 0 || dy <= 0) return
    const driving = ((d / m) * g) * dy
    const transitCost = t * dy
    setResult({ driving, transitCost, savings: Math.abs(driving - transitCost), cheaper: driving < transitCost ? 'Driving' : 'Transit' })
  }

  return (
    <FormCalculatorShell title="Commute Cost Calculator" subtitle="Compare driving vs transit" badge="EVERYDAY">
      <RetroInput label="Daily Distance" value={distance} onChange={setDistance} unit="mi" id="comm-dist" />
      <RetroInput label="MPG" value={mpg} onChange={setMpg} unit="mpg" id="comm-mpg" />
      <RetroInput label="Gas Price" value={gasPrice} onChange={setGasPrice} unit="$/gal" id="comm-gas" />
      <RetroInput label="Daily Transit Cost" value={transit} onChange={setTransit} unit="$" id="comm-transit" />
      <RetroInput label="Days per Week" value={days} onChange={setDays} id="comm-days" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Compare Costs</RetroActionButton></div>
      {result && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label="Driving Cost / Week" value={`$${result.driving.toFixed(2)}`} large />
          <ResultDisplay label="Transit Cost / Week" value={`$${result.transitCost.toFixed(2)}`} />
          <ResultDisplay label={`Cheaper: ${result.cheaper}`} value={`Save $${result.savings.toFixed(2)}/wk`} />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 40 - Math.min(result.driving * 3, 35), 80, Math.min(result.driving * 3, 35))} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(110, 40 - Math.min(result.transitCost * 3, 35), 80, Math.min(result.transitCost * 3, 35))} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <text x="50" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Drive</text>
            <text x="150" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Transit</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}