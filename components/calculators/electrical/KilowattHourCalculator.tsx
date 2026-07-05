'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function KilowattHourCalculator() {
  const [watts, setWatts] = useState('100')
  const [hours, setHours] = useState('8')
  const [rate, setRate] = useState('0.15')

  const w = parseFloat(watts) || 0
  const h = parseFloat(hours) || 0
  const r = parseFloat(rate) || 0

  const dailyKwh = (w * h) / 1000
  const monthlyKwh = dailyKwh * 30
  const monthlyCost = monthlyKwh * r

  const valid = w > 0 && h > 0

  const barH = Math.min(80, dailyKwh * 20)

  return (
    <FormCalculatorShell
      title="Kilowatt-Hour Calculator"
      subtitle="Estimate energy usage and cost"
      badge="ELECTRICAL"
    >
      <div>
        <RetroInput label="Power" value={watts} onChange={setWatts} unit="W" min={0} />
        <RetroInput label="Hours / Day" value={hours} onChange={setHours} unit="h" min={0} />
        <RetroInput label="Electricity Rate" value={rate} onChange={setRate} unit="$/kWh" step={0.01} min={0} />
      </div>

      <div className="space-y-2 mt-2">
        {valid && (
          <>
            <ResultDisplay label="Daily Usage" value={dailyKwh.toFixed(3)} unit="kWh" large />
            <ResultDisplay label="Monthly Usage" value={monthlyKwh.toFixed(2)} unit="kWh" />
            <ResultDisplay label="Monthly Cost" value={`$${monthlyCost.toFixed(2)}`} />
          </>
        )}
      </div>

      {valid && (
        <div className="mt-3 flex justify-center">
          <svg width="120" height="100" viewBox="0 0 120 100">
            <path d={wobblyBar(20, 90 - barH, 30, barH)} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(60, 90 - barH * 2, 30, Math.min(80, barH * 2))} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <line x1="10" y1="90" x2="110" y2="90" stroke="#888" strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}