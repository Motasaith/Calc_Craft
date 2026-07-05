'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`
}

export default function AmpCalculator() {
  const [watts, setWatts] = useState('1200')
  const [volts, setVolts] = useState('120')

  const w = parseFloat(watts) || 0
  const v = parseFloat(volts) || 0

  const amps = v > 0 ? w / v : 0

  const valid = w > 0 && v > 0

  const radius = Math.min(40, Math.sqrt(amps) * 3)

  return (
    <FormCalculatorShell
      title="Amp Calculator"
      subtitle="Watts ÷ Volts = Amps"
      badge="ELECTRICAL"
    >
      <div>
        <RetroInput label="Watts" value={watts} onChange={setWatts} unit="W" min={0} />
        <RetroInput label="Volts" value={volts} onChange={setVolts} unit="V" min={0} />
      </div>

      <div className="space-y-2 mt-2">
        {valid && <ResultDisplay label="Current" value={amps.toFixed(2)} unit="A" large />}
      </div>

      {valid && (
        <div className="mt-3 flex justify-center">
          <svg width="120" height="100" viewBox="0 0 120 100">
            <path d={wobblyCircle(60, 50, radius)} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}