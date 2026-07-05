'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function NDFilterCalculator() {
  const [shutter, setShutter] = useState('125')
  const [stops, setStops] = useState('3')

  const sh = parseFloat(shutter), st = parseFloat(stops)
  const valid = !isNaN(sh) && !isNaN(st) && sh > 0 && st >= 0
  const factor = valid ? Math.pow(2, st) : 0
  const newShutter = valid ? sh / factor : 0

  return (
    <FormCalculatorShell title="ND Filter Calculator" subtitle="New shutter = old / 2^stops" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Current Shutter" value={shutter} onChange={setShutter} placeholder="125" id="nd-sh" unit="1/x" />
        <RetroInput label="ND Stops" value={stops} onChange={setStops} placeholder="3" id="nd-st" unit="stops" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="ND Factor" value={`ND${factor.toFixed(0)}`} large />
            <ResultDisplay label="New Shutter" value={`1/${newShutter.toFixed(2)}`} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Light Reduction</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="ndGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#ndGrid)" rx="8" />
              {/* Full light */}
              <path d={wobblyRect(20, 15, 50, 35)} fill="#fbbf24" fillOpacity="0.5" stroke="#d97706" strokeWidth="2" />
              <text x="45" y="60" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#d97706">Before</text>
              {/* Reduced light */}
              <path d={wobblyRect(90, 15, 50, 35)} fill="#fbbf24" fillOpacity={Math.max(0.05, 0.5 / factor)} stroke="#d97706" strokeWidth="2" />
              <text x="115" y="60" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#d97706">After ND{factor.toFixed(0)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}