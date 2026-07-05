'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function BatteryCapacityCalculator() {
  const [ah, setAh] = useState('100')
  const [load, setLoad] = useState('150')
  const [voltage, setVoltage] = useState('12')

  const capacity = parseFloat(ah) || 0
  const watts = parseFloat(load) || 0
  const volts = parseFloat(voltage) || 0

  // Runtime = (Ah * V * efficiency) / W, assume 85% efficiency (lead-acid)
  const runtime = watts > 0 ? (capacity * volts * 0.85) / watts : 0
  const wattHours = capacity * volts

  const valid = capacity > 0 && watts > 0 && volts > 0

  const barH = Math.min(80, runtime * 4)

  return (
    <FormCalculatorShell
      title="Battery Capacity Calculator"
      subtitle="Estimate battery runtime"
      badge="ELECTRICAL"
    >
      <div>
        <RetroInput label="Battery Capacity" value={ah} onChange={setAh} unit="Ah" min={0} />
        <RetroInput label="Load" value={load} onChange={setLoad} unit="W" min={0} />
        <RetroInput label="System Voltage" value={voltage} onChange={setVoltage} unit="V" min={0} />
      </div>

      <div className="space-y-2 mt-2">
        {valid && (
          <>
            <ResultDisplay label="Runtime" value={runtime.toFixed(2)} unit="hours" large />
            <ResultDisplay label="Total Energy" value={wattHours.toFixed(0)} unit="Wh" />
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