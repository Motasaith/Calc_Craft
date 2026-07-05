'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function OhmsLawScienceCalculator() {
  const [voltage, setVoltage] = useState('')
  const [current, setCurrent] = useState('')
  const [resistance, setResistance] = useState('')

  const V = parseFloat(voltage)
  const I = parseFloat(current)
  const R = parseFloat(resistance)

  const hasV = !isNaN(V)
  const hasI = !isNaN(I)
  const hasR = !isNaN(R)
  const count = [hasV, hasI, hasR].filter(Boolean).length

  let outV: number | null = null
  let outI: number | null = null
  let outR: number | null = null
  let outP: number | null = null

  if (count === 2) {
    if (hasV && hasI) {
      outR = V / I
      outP = V * I
    } else if (hasV && hasR) {
      outI = V / R
      outP = V * outI
    } else if (hasI && hasR) {
      outV = I * R
      outP = outV * I
    }
  }

  const fmt = (n: number | null) => (n === null ? '—' : n.toFixed(4))
  const valid = count === 2

  // Visualizer: bar heights proportional to V, I, R, P
  const maxVal = Math.max(outV ?? 1, outI ?? 1, outR ?? 1, outP ?? 1, 1)
  const bars = [
    { label: 'V', val: outV ?? (hasV ? V : 0), color: '#dfaa44' },
    { label: 'I', val: outI ?? (hasI ? I : 0), color: '#5b8c5a' },
    { label: 'R', val: outR ?? (hasR ? R : 0), color: '#4a6fa5' },
    { label: 'P', val: outP ?? 0, color: '#ab3232' },
  ]

  return (
    <FormCalculatorShell
      title="Ohm's Law"
      subtitle="Enter any two of V, I, R to solve the rest"
      badge="SCIENCE"
    >
      <div>
        <RetroInput label="Voltage (V)" value={voltage} onChange={setVoltage} unit="V" placeholder="e.g. 12" />
        <RetroInput label="Current (I)" value={current} onChange={setCurrent} unit="A" placeholder="e.g. 2" />
        <RetroInput label="Resistance (R)" value={resistance} onChange={setResistance} unit="Ω" placeholder="e.g. 6" />
      </div>

      {valid && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <ResultDisplay label="Voltage" value={fmt(outV ?? (hasV ? V : null))} unit="V" />
          <ResultDisplay label="Current" value={fmt(outI ?? (hasI ? I : null))} unit="A" />
          <ResultDisplay label="Resistance" value={fmt(outR ?? (hasR ? R : null))} unit="Ω" />
          <ResultDisplay label="Power" value={fmt(outP)} unit="W" large />
        </div>
      )}

      {count !== 2 && (
        <div className="text-[10px] text-neutral-500 font-mono mb-3">
          Enter exactly two values to compute the remaining quantities.
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 bg-[#f4f1ea] rounded-lg border border-neutral-300">
        {bars.map((b, i) => {
          const h = Math.max(2, (b.val / maxVal) * 60)
          const x = 20 + i * 45
          const y = 70 - h
          return (
            <g key={b.label}>
              <path d={wobblyBar(x, y, 30, h)} fill={b.color} opacity={0.85} />
              <text x={x + 15} y={78} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#555">{b.label}</text>
            </g>
          )
        })}
      </svg>
    </FormCalculatorShell>
  )
}