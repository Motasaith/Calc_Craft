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
    const jy = (Math.sin(i * 2.7) - 0.5) * 1.0
    path += ` L ${x1 + dx * t} ${y1 + dy * t + jy}`
  }
  return path
}

export default function RunningPaceSportsCalculator() {
  const [distance, setDistance] = useState('5')
  const [minutes, setMinutes] = useState('25')
  const [seconds, setSeconds] = useState('0')

  const d = parseFloat(distance), m = parseFloat(minutes), s = parseFloat(seconds)
  const valid = !isNaN(d) && !isNaN(m) && !isNaN(s) && d > 0 && m >= 0 && s >= 0
  const totalSec = valid ? m * 60 + s : 0
  const paceSec = valid ? totalSec / d : 0
  const paceMin = valid ? Math.floor(paceSec / 60) : 0
  const paceSecRemain = valid ? Math.round(paceSec % 60) : 0
  const speed = valid ? d / (totalSec / 3600) : 0

  return (
    <FormCalculatorShell title="Running Pace" subtitle="Pace = Time / Distance" badge="SPORTS">
      <RetroInput label="Distance" value={distance} onChange={setDistance} placeholder="5" id="rp-d" unit="km" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Minutes" value={minutes} onChange={setMinutes} placeholder="25" id="rp-m" unit="min" />
        <RetroInput label="Seconds" value={seconds} onChange={setSeconds} placeholder="0" id="rp-s" unit="s" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Pace" value={`${paceMin}:${paceSecRemain.toString().padStart(2, '0')}`} unit="/km" large />
            <ResultDisplay label="Speed" value={speed.toFixed(1)} unit="km/h" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Pace Bar</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="rpGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#rpGrid)" rx="8" />
              <path d={wobblyLine(20, 45, 160, 45)} stroke="#9ca3af" strokeWidth="2" />
              <circle cx={20 + Math.min(130, (speed / 20) * 130)} cy="45" r="6" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ea580c" fontWeight="bold">{paceMin}:{paceSecRemain.toString().padStart(2, '0')} /km</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}