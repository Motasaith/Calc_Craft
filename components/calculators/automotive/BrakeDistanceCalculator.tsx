'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function BrakeDistanceCalculator() {
  const [speed, setSpeed] = useState('60')
  const [friction, setFriction] = useState('0.7')

  const s = parseFloat(speed), f = parseFloat(friction)
  const valid = !isNaN(s) && !isNaN(f) && s > 0 && f > 0
  const g = 9.81
  // d = v² / (2 × μ × g), v in m/s
  const vMs = valid ? s * 0.44704 : 0 // mph to m/s
  const distance = valid ? (vMs * vMs) / (2 * f * g) : 0
  const distanceFt = valid ? distance * 3.281 : 0

  return (
    <FormCalculatorShell title="Braking Distance" subtitle="d = v² / (2μg)" badge="AUTOMOTIVE">
      <RetroInput label="Speed" value={speed} onChange={setSpeed} placeholder="60" id="bd-s" unit="mph" />
      <RetroInput label="Friction Coeff (μ)" value={friction} onChange={setFriction} placeholder="0.7" id="bd-f" unit="" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Brake Distance" value={distanceFt.toFixed(1)} unit="ft" large />
            <ResultDisplay label="In Meters" value={distance.toFixed(1)} unit="m" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Stop Distance</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="bdGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#bdGrid)" rx="8" />
              {/* Road */}
              <path d="M 15 50 L 165 50" stroke="#6b7280" strokeWidth="2" />
              {/* Car */}
              <rect x="20" y="37" width="25" height="13" fill="#3b82f6" stroke="#1e40af" strokeWidth="1.5" rx="3" />
              {/* Skid marks */}
              <path d={`M 45 50 L ${45 + Math.min(110, distanceFt * 0.5)} 50`} stroke="#1e1b4b" strokeWidth="3" strokeDasharray="5 3" />
              <text x="90" y="68" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#1e40af" fontWeight="bold">{distanceFt.toFixed(0)} ft to stop</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}