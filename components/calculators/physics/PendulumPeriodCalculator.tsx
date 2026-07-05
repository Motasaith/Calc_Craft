'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyWave(cx: number, cy: number, amp: number, freq: number, width: number) {
  const steps = 40
  let path = `M ${cx} ${cy}`
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const x = cx + width * t
    const y = cy + amp * Math.sin(freq * t * Math.PI * 2) + (Math.sin(i * 3.3) - 0.5) * 0.8
    path += ` L ${x} ${y}`
  }
  return path
}

export default function PendulumPeriodCalculator() {
  const [length, setLength] = useState('1')
  const g = 9.81

  const l = parseFloat(length)
  const valid = !isNaN(l) && l > 0
  const period = valid ? 2 * Math.PI * Math.sqrt(l / g) : 0
  const freq = valid ? 1 / period : 0

  return (
    <FormCalculatorShell title="Pendulum Period" subtitle="T = 2π√(L/g)" badge="PHYSICS">
      <RetroInput label="Length (L)" value={length} onChange={setLength} placeholder="e.g. 1" id="pd-l" unit="m" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Period" value={period.toFixed(3)} unit="s" large />
            <ResultDisplay label="Frequency" value={freq.toFixed(3)} unit="Hz" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Pendulum Swing</span>
            <svg width="160" height="120" viewBox="0 0 160 120" className="select-none">
              <defs>
                <pattern id="pdGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="120" fill="url(#pdGrid)" rx="8" />
              {/* Pivot */}
              <circle cx="80" cy="15" r="4" fill="#4c5c4a" />
              {/* String */}
              <path d={wobblyWave(80, 15, 0, 0, 0)} />
              <path d={`M 80 15 L ${80 + Math.sin(period * 2) * 30} ${15 + Math.min(80, l * 50)}`} stroke="#6b7280" strokeWidth="1.5" />
              {/* Bob */}
              <circle cx={80 + Math.sin(period * 2) * 30} cy={15 + Math.min(80, l * 50)} r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              {/* Arc path */}
              <path d={`M ${80 - 30} ${15 + Math.min(80, l * 50) * 0.7} A ${Math.min(80, l * 50)} ${Math.min(80, l * 50)} 0 0 1 ${80 + 30} ${15 + Math.min(80, l * 50) * 0.7}`} fill="none" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
              <text x="80" y="115" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">T = {period.toFixed(2)} s</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}