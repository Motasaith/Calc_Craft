'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  const steps = 28
  let path = ''
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2
    const jitter = (Math.sin(i * 3.1) - 0.5) * 1.0
    const x = cx + (r + jitter) * Math.cos(theta)
    const y = cy + (r + jitter) * Math.sin(theta)
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return path + ' Z'
}

export default function HalfLifeCalculator() {
  const [initial, setInitial] = useState('100')
  const [halfLife, setHalfLife] = useState('5')
  const [time, setTime] = useState('10')

  const n0 = parseFloat(initial), tHalf = parseFloat(halfLife), t = parseFloat(time)
  const valid = !isNaN(n0) && !isNaN(tHalf) && !isNaN(t) && tHalf > 0 && n0 >= 0 && t >= 0
  const remaining = valid ? n0 * Math.pow(0.5, t / tHalf) : 0
  const decayed = valid ? n0 - remaining : 0

  return (
    <FormCalculatorShell title="Half-Life Calculator" subtitle="N = N₀ × (½)^(t/T)" badge="CHEMISTRY">
      <RetroInput label="Initial Amount (N₀)" value={initial} onChange={setInitial} placeholder="100" id="hl-n0" unit="g" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Half-Life (T)" value={halfLife} onChange={setHalfLife} placeholder="5" id="hl-t" unit="yr" />
        <RetroInput label="Time Elapsed" value={time} onChange={setTime} placeholder="10" id="hl-e" unit="yr" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Remaining" value={remaining.toFixed(4)} unit="g" large />
            <ResultDisplay label="Decayed" value={decayed.toFixed(4)} unit="g" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Decay Curve</span>
            <svg width="180" height="100" viewBox="0 0 180 100" className="select-none">
              <defs>
                <pattern id="hlGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="100" fill="url(#hlGrid)" rx="8" />
              <path d="M 25 85 L 25 15" stroke="#6b7280" strokeWidth="1.5" />
              <path d="M 25 85 L 165 85" stroke="#6b7280" strokeWidth="1.5" />
              {/* Decay curve */}
              {(() => {
                const steps = 30
                let path = `M 25 85`
                for (let i = 1; i <= steps; i++) {
                  const tt = (i / steps) * Math.max(t, tHalf * 3)
                  const val = n0 * Math.pow(0.5, tt / tHalf)
                  const x = 25 + (i / steps) * 140
                  const y = 85 - (val / n0) * 65
                  path += ` L ${x} ${y}`
                }
                return <path d={path} fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
              })()}
              {/* Current time marker */}
              <circle cx={25 + Math.min(140, (t / Math.max(t, tHalf * 3)) * 140)} cy={85 - (remaining / n0) * 65} r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <text x="90" y="12" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">N = {remaining.toFixed(2)} g</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}