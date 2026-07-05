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

export default function TorqueCalculator() {
  const [force, setForce] = useState('50')
  const [lever, setLever] = useState('0.3')
  const [angle, setAngle] = useState('90')

  const f = parseFloat(force), r = parseFloat(lever), ang = parseFloat(angle)
  const valid = !isNaN(f) && !isNaN(r) && !isNaN(ang) && f >= 0 && r >= 0
  const rad = (ang * Math.PI) / 180
  const torque = valid ? r * f * Math.sin(rad) : 0

  return (
    <FormCalculatorShell title="Torque Calculator" subtitle="τ = r × F × sin(θ)" badge="PHYSICS">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Force (F)" value={force} onChange={setForce} placeholder="50" id="tq-f" unit="N" />
        <RetroInput label="Lever Arm (r)" value={lever} onChange={setLever} placeholder="0.3" id="tq-r" unit="m" />
      </div>
      <RetroInput label="Angle (θ)" value={angle} onChange={setAngle} placeholder="90" id="tq-a" unit="°" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Torque" value={torque.toFixed(4)} unit="N·m" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Lever Arm Diagram</span>
            <svg width="180" height="90" viewBox="0 0 180 90" className="select-none">
              <defs>
                <pattern id="tqGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="90" fill="url(#tqGrid)" rx="8" />
              {/* Pivot */}
              <circle cx="30" cy="55" r="5" fill="#4c5c4a" />
              {/* Lever arm */}
              <path d={wobblyLine(30, 55, 30 + Math.min(100, r * 200), 55)} stroke="#6b7280" strokeWidth="3" />
              {/* Force arrow at angle */}
              <path d={`M ${30 + Math.min(100, r * 200)} 55 L ${30 + Math.min(100, r * 200)} ${55 - Math.min(50, f / 2)}`} stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
              <path d={`M ${30 + Math.min(100, r * 200)} ${55 - Math.min(50, f / 2)} L ${30 + Math.min(100, r * 200) - 5} ${55 - Math.min(50, f / 2) + 7} L ${30 + Math.min(100, r * 200) + 5} ${55 - Math.min(50, f / 2) + 7} Z`} fill="#dc2626" />
              <text x="90" y="82" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">τ = {torque.toFixed(2)} N·m</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}