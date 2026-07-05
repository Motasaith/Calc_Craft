'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function OvenTempCalculator() {
  const [temp, setTemp] = useState('350')
  const [fromUnit, setFromUnit] = useState('F')
  const [toUnit, setToUnit] = useState('C')

  const t = parseFloat(temp)
  const valid = !isNaN(t)
  let result = 0
  if (valid) {
    if (fromUnit === 'F' && toUnit === 'C') result = (t - 32) * 5 / 9
    else if (fromUnit === 'C' && toUnit === 'F') result = t * 9 / 5 + 32
    else if (fromUnit === 'C' && toUnit === 'Gas') result = t < 120 ? 0.25 : t < 150 ? 1 : t < 170 ? 2 : t < 190 ? 3 : t < 200 ? 4 : t < 220 ? 5 : t < 230 ? 6 : t < 240 ? 7 : 8
    else if (fromUnit === 'F' && toUnit === 'Gas') {
      const c = (t - 32) * 5 / 9
      result = c < 120 ? 0.25 : c < 150 ? 1 : c < 170 ? 2 : c < 190 ? 3 : c < 200 ? 4 : c < 220 ? 5 : c < 230 ? 6 : c < 240 ? 7 : 8
    } else result = t
  }

  return (
    <FormCalculatorShell title="Oven Temperature" subtitle="Convert °F, °C, Gas Mark" badge="COOKING">
      <RetroInput label="Temperature" value={temp} onChange={setTemp} placeholder="350" id="ot-t" unit={fromUnit} />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="From" value={fromUnit} onChange={setFromUnit} placeholder="F" id="ot-f" unit="" />
        <RetroInput label="To" value={toUnit} onChange={setToUnit} placeholder="C" id="ot-tu" unit="" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label={`Converted (${toUnit})`} value={toUnit === 'Gas' ? `Gas Mark ${result}` : result.toFixed(1)} unit={toUnit === 'Gas' ? '' : `°${toUnit}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Heat Level</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="otGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#otGrid)" rx="8" />
              <path d={wobblyBar(15, 25, 150, 25)} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" rx="3" />
              <path d={wobblyBar(15, 25, Math.min(150, (Math.abs(t) / 500) * 150), 25)} fill="#f97316" fillOpacity="0.4" stroke="#ea580c" strokeWidth="1.5" rx="3" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ea580c" fontWeight="bold">{toUnit === 'Gas' ? `Gas ${result}` : `${result.toFixed(0)}°${toUnit}`}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}