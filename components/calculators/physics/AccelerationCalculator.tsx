'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCurve(x0: number, y0: number, x1: number, y1: number, curve = 0.5) {
  const steps = 20
  let path = `M ${x0} ${y0}`
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const x = x0 + (x1 - x0) * t
    // Parabolic interpolation
    const y = y0 + (y1 - y0) * t * t * curve + (y1 - y0) * t * (1 - curve)
    const jy = (Math.sin(i * 2.3) - 0.5) * 0.8
    path += ` L ${x} ${y + jy}`
  }
  return path
}

export default function AccelerationCalculator() {
  const [v0, setV0] = useState('0')
  const [v1, setV1] = useState('20')
  const [time, setTime] = useState('5')

  const vi = parseFloat(v0), vf = parseFloat(v1), t = parseFloat(time)
  const valid = !isNaN(vi) && !isNaN(vf) && !isNaN(t) && t > 0
  const accel = valid ? (vf - vi) / t : 0

  return (
    <FormCalculatorShell title="Acceleration Calculator" subtitle="a = (vf - vi) / t" badge="PHYSICS">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Initial Vel (vi)" value={v0} onChange={setV0} placeholder="0" id="acc-vi" unit="m/s" />
        <RetroInput label="Final Vel (vf)" value={v1} onChange={setV1} placeholder="20" id="acc-vf" unit="m/s" />
      </div>
      <RetroInput label="Time (t)" value={time} onChange={setTime} placeholder="e.g. 5" id="acc-t" unit="s" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Acceleration" value={accel.toFixed(2)} unit="m/s²" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Velocity-Time Curve</span>
            <svg width="180" height="110" viewBox="0 0 180 110" className="select-none">
              <defs>
                <pattern id="aGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="110" fill="url(#aGrid)" rx="8" />
              {/* Axes */}
              <path d="M 25 95 L 25 15" stroke="#6b7280" strokeWidth="1.5" />
              <path d="M 25 95 L 165 95" stroke="#6b7280" strokeWidth="1.5" />
              <text x="15" y="20" fontSize="8" fontFamily="monospace" fill="#6b7280">v</text>
              <text x="160" y="108" fontSize="8" fontFamily="monospace" fill="#6b7280">t</text>
              {/* Curve from (25, 95-vi*scale) to (165, 95-vf*scale) */}
              <path d={wobblyCurve(25, 95 - Math.min(70, vi * 2), 165, 95 - Math.min(70, vf * 2))} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
              <text x="90" y="12" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#2563eb" fontWeight="bold">a = {accel.toFixed(2)} m/s²</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}