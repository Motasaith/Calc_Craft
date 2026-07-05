'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function SprintSpeedCalculator() {
  const [distance, setDistance] = useState('100')
  const [time, setTime] = useState('10')

  const d = parseFloat(distance), t = parseFloat(time)
  const valid = !isNaN(d) && !isNaN(t) && d > 0 && t > 0
  const speedMs = valid ? d / t : 0
  const speedKmh = valid ? speedMs * 3.6 : 0

  return (
    <FormCalculatorShell title="Sprint Speed Calculator" subtitle="Speed = Distance / Time" badge="SPORTS">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Distance" value={distance} onChange={setDistance} placeholder="100" id="ss-d" unit="m" />
        <RetroInput label="Time" value={time} onChange={setTime} placeholder="10" id="ss-t" unit="s" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Speed" value={speedMs.toFixed(2)} unit="m/s" large />
            <ResultDisplay label="Speed" value={speedKmh.toFixed(2)} unit="km/h" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Speed Gauge</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="ssGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#ssGrid)" rx="8" />
              <path d={wobblyBar(15, 25, 150, 25)} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" rx="3" />
              <path d={wobblyBar(15, 25, Math.min(150, (speedKmh / 50) * 150), 25)} fill="#f97316" fillOpacity="0.4" stroke="#ea580c" strokeWidth="1.5" rx="3" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ea580c" fontWeight="bold">{speedKmh.toFixed(1)} km/h</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}