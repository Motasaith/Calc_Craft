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
    const jx = (Math.sin(i * 2.7) - 0.5) * 1.0
    path += ` L ${x1 + dx * t + jx} ${y1 + dy * t}`
  }
  return path
}

export default function FreeFallCalculator() {
  const [height, setHeight] = useState('45')
  const g = 9.81

  const h = parseFloat(height)
  const valid = !isNaN(h) && h >= 0
  const t = valid ? Math.sqrt((2 * h) / g) : 0
  const vFinal = valid ? g * t : 0

  // Object position in SVG (falls from top to bottom)
  const fallPct = Math.min(1, h / 100)
  const objY = 15 + fallPct * 85

  return (
    <FormCalculatorShell title="Free Fall Calculator" subtitle="t = √(2h/g), v = g×t" badge="PHYSICS">
      <RetroInput label="Height (h)" value={height} onChange={setHeight} placeholder="e.g. 45" id="ff-h" unit="m" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Fall Time" value={t.toFixed(2)} unit="s" large />
            <ResultDisplay label="Final Velocity" value={vFinal.toFixed(2)} unit="m/s" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Free Fall Path</span>
            <svg width="120" height="120" viewBox="0 0 120 120" className="select-none">
              <defs>
                <pattern id="ffGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="120" height="120" fill="url(#ffGrid)" rx="8" />
              {/* Start position */}
              <circle cx="60" cy="15" r="6" fill="#fbbf24" stroke="#d97706" strokeWidth="2" opacity="0.4" />
              {/* Fall path */}
              <path d={wobblyLine(60, 15, 60, objY)} stroke="#2563eb" strokeWidth="2" strokeDasharray="3 3" />
              {/* Current object */}
              <circle cx="60" cy={objY} r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              {/* Ground */}
              <path d={wobblyLine(15, 108, 105, 108)} stroke="#4c5c4a" strokeWidth="2.5" />
              <text x="60" y="118" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#78350f" fontWeight="bold">t={t.toFixed(2)}s</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}