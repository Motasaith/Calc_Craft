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

export default function ProjectileRangeCalculator() {
  const [vel, setVel] = useState('20')
  const [angle, setAngle] = useState('45')
  const g = 9.81

  const v = parseFloat(vel), ang = parseFloat(angle)
  const valid = !isNaN(v) && !isNaN(ang) && v >= 0
  const rad = (ang * Math.PI) / 180
  const range = valid ? (v * v * Math.sin(2 * rad)) / g : 0
  const maxH = valid ? (v * v * Math.sin(rad) ** 2) / (2 * g) : 0
  const tFlight = valid ? (2 * v * Math.sin(rad)) / g : 0

  // Trajectory points
  const points: string[] = []
  if (valid) {
    const steps = 30
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tFlight
      const x = v * Math.cos(rad) * t
      const y = v * Math.sin(rad) * t - 0.5 * g * t * t
      points.push(`${15 + (x / Math.max(range, 1)) * 150},${105 - Math.max(0, (y / Math.max(maxH, 1)) * 70)}`)
    }
  }

  return (
    <FormCalculatorShell title="Projectile Motion" subtitle="R = v²sin(2θ)/g" badge="PHYSICS">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Velocity (v)" value={vel} onChange={setVel} placeholder="20" id="pj-v" unit="m/s" />
        <RetroInput label="Angle (θ)" value={angle} onChange={setAngle} placeholder="45" id="pj-a" unit="°" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ResultDisplay label="Range" value={range.toFixed(1)} unit="m" />
            <ResultDisplay label="Max Height" value={maxH.toFixed(1)} unit="m" />
            <ResultDisplay label="Flight Time" value={tFlight.toFixed(2)} unit="s" />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Trajectory</span>
            <svg width="180" height="120" viewBox="0 0 180 120" className="select-none">
              <defs>
                <pattern id="pjGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="120" fill="url(#pjGrid)" rx="8" />
              <path d={wobblyLine(15, 105, 170, 105)} stroke="#4c5c4a" strokeWidth="2" />
              {points.length > 1 && (
                <path d={`M ${points.join(' L ')}`} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
              )}
              <text x="90" y="118" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb" fontWeight="bold">R = {range.toFixed(1)} m</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}