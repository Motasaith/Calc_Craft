'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1, dy = y2 - y1
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist < 5) return `M ${x1} ${y1} L ${x2} ${y2}`
  const steps = Math.max(3, Math.floor(dist / 10))
  let path = `M ${x1} ${y1}`
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const jy = (Math.sin(i * 2.1) - 0.5) * 1.0
    path += ` L ${x1 + dx * t} ${y1 + dy * t + jy}`
  }
  return path
}

export default function VelocityCalculator() {
  const [dist, setDist] = useState('100')
  const [time, setTime] = useState('10')

  const d = parseFloat(dist), t = parseFloat(time)
  const valid = !isNaN(d) && !isNaN(t) && d >= 0 && t > 0
  const vel = valid ? d / t : 0

  // Arrow length scales with velocity
  const arrowLen = Math.min(120, (vel / 50) * 120 + 15)

  return (
    <FormCalculatorShell title="Velocity Calculator" subtitle="v = d / t" badge="PHYSICS">
      <RetroInput label="Distance (d)" value={dist} onChange={setDist} placeholder="e.g. 100" id="vel-dist" unit="m" />
      <RetroInput label="Time (t)" value={time} onChange={setTime} placeholder="e.g. 10" id="vel-time" unit="s" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Velocity" value={vel.toFixed(2)} unit="m/s" large />
            <ResultDisplay label="Speed (km/h)" value={(vel * 3.6).toFixed(2)} unit="km/h" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Motion Diagram</span>
            <svg width="200" height="70" viewBox="0 0 200 70" className="select-none">
              <defs>
                <pattern id="vGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="200" height="70" fill="url(#vGrid)" rx="8" />
              {/* Track */}
              <path d={wobblyLine(15, 45, 185, 45)} stroke="#9ca3af" strokeWidth="2" />
              {/* Object */}
              <circle cx="30" cy="35" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              {/* Velocity arrow */}
              <path d={wobblyLine(42, 35, 42 + arrowLen, 35)} stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
              <path d={`M ${42 + arrowLen} 35 L ${42 + arrowLen - 7} 30 L ${42 + arrowLen - 7} 40 Z`} fill="#2563eb" />
              <text x="100" y="20" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#2563eb" fontWeight="bold">v = {vel.toFixed(1)} m/s</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}