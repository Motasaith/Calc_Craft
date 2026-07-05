'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function SwimmingPaceCalculator() {
  const [distance, setDistance] = useState('100')
  const [minutes, setMinutes] = useState('2')
  const [seconds, setSeconds] = useState('0')

  const d = parseFloat(distance), m = parseFloat(minutes), s = parseFloat(seconds)
  const valid = !isNaN(d) && !isNaN(m) && !isNaN(s) && d > 0 && m >= 0 && s >= 0
  const totalSec = valid ? m * 60 + s : 0
  const pacePer100 = valid ? (totalSec / d) * 100 : 0
  const paceMin = valid ? Math.floor(pacePer100 / 60) : 0
  const paceSec = valid ? Math.round(pacePer100 % 60) : 0

  return (
    <FormCalculatorShell title="Swimming Pace" subtitle="Pace per 100m" badge="SPORTS">
      <RetroInput label="Distance" value={distance} onChange={setDistance} placeholder="100" id="sw-d" unit="m" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Minutes" value={minutes} onChange={setMinutes} placeholder="2" id="sw-m" unit="min" />
        <RetroInput label="Seconds" value={seconds} onChange={setSeconds} placeholder="0" id="sw-s" unit="s" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Pace per 100m" value={`${paceMin}:${paceSec.toString().padStart(2, '0')}`} unit="/100m" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Swim Pace</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="swGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#swGrid)" rx="8" />
              <path d={wobblyBar(15, 25, 150, 25)} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" rx="3" />
              <path d={wobblyBar(15, 25, Math.min(150, Math.max(10, 150 - (pacePer100 / 10) * 20)), 25)} fill="#60a5fa" fillOpacity="0.4" stroke="#2563eb" strokeWidth="1.5" rx="3" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb" fontWeight="bold">{paceMin}:{paceSec.toString().padStart(2, '0')} /100m</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}