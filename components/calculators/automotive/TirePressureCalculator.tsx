'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function TirePressureCalculator() {
  const [front, setFront] = useState('32')
  const [rear, setRear] = useState('30')
  const [recommended, setRecommended] = useState('35')

  const f = parseFloat(front), r = parseFloat(rear), rec = parseFloat(recommended)
  const valid = !isNaN(f) && !isNaN(r) && !isNaN(rec) && rec > 0
  const frontDiff = valid ? f - rec : 0
  const rearDiff = valid ? r - rec : 0

  return (
    <FormCalculatorShell title="Tire Pressure" subtitle="Compare to recommended PSI" badge="AUTOMOTIVE">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Front PSI" value={front} onChange={setFront} placeholder="32" id="tp-f" unit="psi" />
        <RetroInput label="Rear PSI" value={rear} onChange={setRear} placeholder="30" id="tp-r" unit="psi" />
      </div>
      <RetroInput label="Recommended PSI" value={recommended} onChange={setRecommended} placeholder="35" id="tp-rec" unit="psi" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Front Diff" value={`${frontDiff > 0 ? '+' : ''}${frontDiff.toFixed(1)}`} unit="psi" large />
            <ResultDisplay label="Rear Diff" value={`${rearDiff > 0 ? '+' : ''}${rearDiff.toFixed(1)}`} unit="psi" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Pressure Gauge</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="tpGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#tpGrid)" rx="8" />
              {/* Front tire */}
              <path d={wobblyBar(20, 20, 50, Math.min(40, f * 1.2))} fill={f >= rec ? '#22c55e' : '#ef4444'} fillOpacity="0.3" stroke={f >= rec ? '#16a34a' : '#dc2626'} strokeWidth="2" />
              <text x="45" y="72" textAnchor="middle" fontSize="7" fontFamily="monospace" fill={f >= rec ? '#16a34a' : '#dc2626'}>Front {f}</text>
              {/* Rear tire */}
              <path d={wobblyBar(90, 20, 50, Math.min(40, r * 1.2))} fill={r >= rec ? '#22c55e' : '#ef4444'} fillOpacity="0.3" stroke={r >= rec ? '#16a34a' : '#dc2626'} strokeWidth="2" />
              <text x="115" y="72" textAnchor="middle" fontSize="7" fontFamily="monospace" fill={r >= rec ? '#16a34a' : '#dc2626'}>Rear {r}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}