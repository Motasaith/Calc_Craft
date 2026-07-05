'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function GeneratorSizeCalculator() {
  const [totalWatts, setTotalWatts] = useState('5000')
  const [startFactor, setStartFactor] = useState('2')

  const watts = parseFloat(totalWatts) || 0
  const factor = parseFloat(startFactor) || 1

  const startingWatts = watts * factor
  const recommendedKw = (startingWatts / 1000) * 1.2 // 20% headroom

  const valid = watts > 0 && factor > 0

  const barH = Math.min(80, recommendedKw * 4)

  return (
    <FormCalculatorShell
      title="Generator Size Calculator"
      subtitle="Size your backup power source"
      badge="ELECTRICAL"
    >
      <div>
        <RetroInput label="Total Appliance Wattage" value={totalWatts} onChange={setTotalWatts} unit="W" min={0} />
        <RetroInput label="Starting Wattage Factor" value={startFactor} onChange={setStartFactor} unit="x" step={0.1} min={1} />
      </div>

      <div className="space-y-2 mt-2">
        {valid && (
          <>
            <ResultDisplay label="Recommended Generator" value={recommendedKw.toFixed(2)} unit="kW" large />
            <ResultDisplay label="Starting Watts" value={Math.round(startingWatts).toLocaleString()} unit="W" />
          </>
        )}
      </div>

      {valid && (
        <div className="mt-3 flex justify-center">
          <svg width="120" height="100" viewBox="0 0 120 100">
            <path d={wobblyBar(20, 90 - barH, 80, barH)} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <line x1="10" y1="90" x2="110" y2="90" stroke="#888" strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}