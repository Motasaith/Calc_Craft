'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(points: [number, number][]) {
  return 'M ' + points.map(([x, y]) => `${x} ${y}`).join(' L ')
}

export default function RadioactiveDecayCalculator() {
  const [initial, setInitial] = useState('100')
  const [halfLife, setHalfLife] = useState('5')
  const [time, setTime] = useState('10')

  const N0 = parseFloat(initial)
  const tHalf = parseFloat(halfLife)
  const t = parseFloat(time)
  const valid = !isNaN(N0) && !isNaN(tHalf) && !isNaN(t) && tHalf > 0 && N0 > 0

  // N = N0 * (1/2)^(t / tHalf)
  const remaining = valid ? N0 * Math.pow(0.5, t / tHalf) : 0
  const decayed = valid ? N0 - remaining : 0

  // Visualizer: exponential decay curve
  const pts: [number, number][] = []
  for (let i = 0; i <= 40; i++) {
    const tt = (i / 40) * t
    const val = N0 * Math.pow(0.5, tt / tHalf)
    const x = 5 + (i / 40) * 190
    const y = 70 - (val / N0) * 60
    pts.push([x, y])
  }

  return (
    <FormCalculatorShell
      title="Radioactive Decay"
      subtitle="N = N₀ · (1/2)^(t / t½)"
      badge="SCIENCE"
    >
      <div>
        <RetroInput label="Initial Amount" value={initial} onChange={setInitial} unit="g" placeholder="e.g. 100" />
        <RetroInput label="Half-Life" value={halfLife} onChange={setHalfLife} unit="yr" placeholder="e.g. 5" />
        <RetroInput label="Time Elapsed" value={time} onChange={setTime} unit="yr" placeholder="e.g. 10" />
      </div>

      {valid && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <ResultDisplay label="Remaining" value={remaining.toFixed(4)} unit="g" large />
          <ResultDisplay label="Decayed" value={decayed.toFixed(4)} unit="g" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 bg-[#f4f1ea] rounded-lg border border-neutral-300">
        <path d={wobblyLine(pts)} fill="none" stroke="#5b8c5a" strokeWidth="2" />
        <text x="100" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#555">decay curve</text>
      </svg>
    </FormCalculatorShell>
  )
}