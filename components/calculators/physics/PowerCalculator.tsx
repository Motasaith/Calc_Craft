'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  const steps = 8
  let top = `M ${x} ${y}`, right = ` L ${x + w} ${y}`, bottom = ` L ${x + w} ${y + h}`, left = ` L ${x} ${y + h}`
  let path = top
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const jy = (Math.sin(i * 2.3) - 0.5) * 0.6
    path += ` L ${x + w * t} ${y + jy}`
  }
  path += ` L ${x + w} ${y + h} L ${x} ${y + h} Z`
  return path
}

export default function PowerCalculator() {
  const [work, setWork] = useState('500')
  const [time, setTime] = useState('10')

  const w = parseFloat(work), t = parseFloat(time)
  const valid = !isNaN(w) && !isNaN(t) && t > 0
  const power = valid ? w / t : 0
  const hp = valid ? power / 745.7 : 0

  const barH = Math.min(90, (power / 200) * 90 + 8)

  return (
    <FormCalculatorShell title="Power Calculator" subtitle="P = W / t" badge="PHYSICS">
      <RetroInput label="Work (W)" value={work} onChange={setWork} placeholder="e.g. 500" id="pw-w" unit="J" />
      <RetroInput label="Time (t)" value={time} onChange={setTime} placeholder="e.g. 10" id="pw-t" unit="s" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Power" value={power.toFixed(2)} unit="W" large />
            <ResultDisplay label="Horsepower" value={hp.toFixed(4)} unit="hp" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Power Gauge</span>
            <svg width="160" height="120" viewBox="0 0 160 120" className="select-none">
              <defs>
                <pattern id="pwGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="120" fill="url(#pwGrid)" rx="8" />
              <path d={wobblyBar(60, 110 - barH, 40, barH)} fill="#fbbf24" fillOpacity="0.4" stroke="#d97706" strokeWidth="2" />
              <path d="M 55 110 L 105 110" stroke="#4c5c4a" strokeWidth="2" />
              <text x="80" y="118" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#78350f" fontWeight="bold">P = {power.toFixed(1)} W</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}