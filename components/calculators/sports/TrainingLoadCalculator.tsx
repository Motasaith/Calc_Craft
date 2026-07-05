'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function TrainingLoadCalculator() {
  const [rpe, setRpe] = useState('7')
  const [duration, setDuration] = useState('60')

  const r = parseFloat(rpe), d = parseFloat(duration)
  const valid = !isNaN(r) && !isNaN(d) && r > 0 && r <= 10 && d > 0
  // Training Load = RPE × Duration (sTRIMP)
  const load = valid ? r * d : 0
  const fatigue = valid ? (load > 500 ? 'High' : load > 300 ? 'Moderate' : 'Low') : ''

  return (
    <FormCalculatorShell title="Training Load" subtitle="Load = RPE × Duration" badge="SPORTS">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="RPE (1-10)" value={rpe} onChange={setRpe} placeholder="7" id="tl-r" unit="" />
        <RetroInput label="Duration" value={duration} onChange={setDuration} placeholder="60" id="tl-d" unit="min" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Training Load" value={load.toFixed(0)} unit="AU" large />
            <ResultDisplay label="Fatigue" value={fatigue} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Load Gauge</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="tlGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#tlGrid)" rx="8" />
              <path d={wobblyBar(15, 25, 150, 25)} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" rx="3" />
              <path d={wobblyBar(15, 25, Math.min(150, (load / 800) * 150), 25)} fill={load > 500 ? '#ef4444' : load > 300 ? '#fbbf24' : '#22c55e'} fillOpacity="0.4" stroke={load > 500 ? '#dc2626' : load > 300 ? '#d97706' : '#16a34a'} strokeWidth="1.5" rx="3" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={load > 500 ? '#dc2626' : load > 300 ? '#d97706' : '#16a34a'} fontWeight="bold">Load: {load.toFixed(0)} — {fatigue}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}