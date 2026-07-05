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

export default function ImpulseCalculator() {
  const [force, setForce] = useState('100')
  const [time, setTime] = useState('0.5')

  const f = parseFloat(force), t = parseFloat(time)
  const valid = !isNaN(f) && !isNaN(t) && f >= 0 && t >= 0
  const impulse = valid ? f * t : 0

  return (
    <FormCalculatorShell title="Impulse Calculator" subtitle="J = F × t" badge="PHYSICS">
      <RetroInput label="Force (F)" value={force} onChange={setForce} placeholder="e.g. 100" id="im-f" unit="N" />
      <RetroInput label="Time (t)" value={time} onChange={setTime} placeholder="e.g. 0.5" id="im-t" unit="s" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Impulse" value={impulse.toFixed(2)} unit="N·s" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Force-Time Graph</span>
            <svg width="180" height="100" viewBox="0 0 180 100" className="select-none">
              <defs>
                <pattern id="imGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="100" fill="url(#imGrid)" rx="8" />
              <path d="M 25 85 L 25 15" stroke="#6b7280" strokeWidth="1.5" />
              <path d="M 25 85 L 165 85" stroke="#6b7280" strokeWidth="1.5" />
              <text x="15" y="20" fontSize="8" fontFamily="monospace" fill="#6b7280">F</text>
              <text x="160" y="98" fontSize="8" fontFamily="monospace" fill="#6b7280">t</text>
              {/* Force bar */}
              <path d={wobblyLine(25, 85 - Math.min(60, f / 3), 25 + Math.min(120, t * 100), 85 - Math.min(60, f / 3))} stroke="#2563eb" strokeWidth="2.5" />
              <path d={`M 25 85 L 25 ${85 - Math.min(60, f / 3)} L ${25 + Math.min(120, t * 100)} ${85 - Math.min(60, f / 3)} L ${25 + Math.min(120, t * 100)} 85 Z`} fill="#2563eb" fillOpacity="0.15" stroke="#2563eb" strokeWidth="1.5" />
              <text x="90" y="12" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#2563eb" fontWeight="bold">J = {impulse.toFixed(1)} N·s</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}