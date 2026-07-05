'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function TimeLapseCalculator() {
  const [interval, setInterval] = useState('5')
  const [duration, setDuration] = useState('60')
  const [fps, setFps] = useState('30')

  const intv = parseFloat(interval), dur = parseFloat(duration), f = parseFloat(fps)
  const valid = !isNaN(intv) && !isNaN(dur) && !isNaN(f) && intv > 0 && dur > 0 && f > 0
  const totalShots = valid ? (dur * 60) / intv : 0
  const videoDuration = valid ? totalShots / f : 0

  return (
    <FormCalculatorShell title="Time-lapse Calculator" subtitle="Shots = (duration × 60) / interval" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-3 gap-2">
        <RetroInput label="Interval" value={interval} onChange={setInterval} placeholder="5" id="tl-i" unit="s" />
        <RetroInput label="Duration" value={duration} onChange={setDuration} placeholder="60" id="tl-d" unit="min" />
        <RetroInput label="FPS" value={fps} onChange={setFps} placeholder="30" id="tl-f" unit="" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Total Shots" value={totalShots.toFixed(0)} large />
            <ResultDisplay label="Video Length" value={videoDuration.toFixed(1)} unit="s" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Capture Timeline</span>
            <svg width="180" height="60" viewBox="0 0 180 60" className="select-none">
              <defs>
                <pattern id="tlGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="60" fill="url(#tlGrid)" rx="8" />
              {/* Timeline */}
              <path d="M 15 30 L 165 30" stroke="#9ca3af" strokeWidth="1.5" />
              {/* Shot markers */}
              {Array.from({ length: Math.min(15, totalShots) }).map((_, i) => (
                <circle key={i} cx={15 + (i / Math.min(15, totalShots)) * 150} cy="30" r="3" fill="#ec4899" stroke="#be185d" strokeWidth="1" />
              ))}
              <text x="90" y="52" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ec4899" fontWeight="bold">{totalShots.toFixed(0)} shots → {videoDuration.toFixed(1)}s video</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}