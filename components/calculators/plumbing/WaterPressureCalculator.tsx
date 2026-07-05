'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function WaterPressureCalculator() {
  const [height, setHeight] = useState('30')

  const h = parseFloat(height)
  const valid = !isNaN(h) && h > 0
  // P (psi) = height (ft) × 0.433
  const psi = valid ? h * 0.433 : 0
  const bar = psi * 0.0689476
  const kpa = psi * 6.89476

  return (
    <FormCalculatorShell title="Water Pressure Calculator" subtitle="P = h × 0.433" badge="PLUMBING">
      <RetroInput label="Water Column Height" value={height} onChange={setHeight} placeholder="30" id="wp-h" unit="ft" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ResultDisplay label="Pressure" value={psi.toFixed(2)} unit="psi" />
            <ResultDisplay label="Pressure" value={bar.toFixed(2)} unit="bar" />
            <ResultDisplay label="Pressure" value={kpa.toFixed(1)} unit="kPa" />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Water Column</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="wpGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#wpGrid)" rx="8" />
              <path d={wobblyBar(60, 10, 40, 70)} fill="#cbd5e1" fillOpacity="0.3" stroke="#64748b" strokeWidth="2" />
              <path d={wobblyBar(62, 10 + 70 - Math.min(60, h), 36, Math.min(60, h))} fill="#60a5fa" fillOpacity="0.4" stroke="#2563eb" strokeWidth="1.5" />
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb" fontWeight="bold">{psi.toFixed(1)} psi</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}