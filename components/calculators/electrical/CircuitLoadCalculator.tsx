'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CircuitLoadCalculator() {
  const [devices, setDevices] = useState('5')
  const [wattage, setWattage] = useState('100')

  const numDevices = parseFloat(devices) || 0
  const wattsEach = parseFloat(wattage) || 0

  const totalWatts = numDevices * wattsEach
  const amps = totalWatts / 120 // assume 120V
  // Breaker at 125% of load
  const breaker = Math.ceil((amps * 1.25) / 5) * 5

  const valid = numDevices > 0 && wattsEach > 0

  const barH = Math.min(80, totalWatts / 25)

  return (
    <FormCalculatorShell
      title="Circuit Load Calculator"
      subtitle="Total load and breaker sizing"
      badge="ELECTRICAL"
    >
      <div>
        <RetroInput label="Number of Devices" value={devices} onChange={setDevices} min={0} />
        <RetroInput label="Wattage Each" value={wattage} onChange={setWattage} unit="W" min={0} />
      </div>

      <div className="space-y-2 mt-2">
        {valid && (
          <>
            <ResultDisplay label="Total Watts" value={totalWatts.toLocaleString()} unit="W" large />
            <ResultDisplay label="Current Draw" value={amps.toFixed(2)} unit="A" />
            <ResultDisplay label="Breaker Size" value={breaker} unit="A" />
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