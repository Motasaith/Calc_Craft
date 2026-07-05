'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function HyperfocalDistanceCalculator() {
  const [focal, setFocal] = useState('50')
  const [aperture, setAperture] = useState('8')
  const [coc, setCoc] = useState('0.03')

  const f = parseFloat(focal), ap = parseFloat(aperture), c = parseFloat(coc)
  const valid = !isNaN(f) && !isNaN(ap) && !isNaN(c) && f > 0 && ap > 0 && c > 0
  const H = valid ? (f * f) / (ap * c) / 1000 : 0 // mm → m
  const nearLimit = valid ? H / 2 : 0

  return (
    <FormCalculatorShell title="Hyperfocal Distance" subtitle="H = f² / (N × c)" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Focal Length" value={focal} onChange={setFocal} placeholder="50" id="hf-f" unit="mm" />
        <RetroInput label="Aperture" value={aperture} onChange={setAperture} placeholder="8" id="hf-ap" unit="f/" />
      </div>
      <RetroInput label="Circle of Confusion" value={coc} onChange={setCoc} placeholder="0.03" id="hf-c" unit="mm" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Hyperfocal" value={H.toFixed(2)} unit="m" large />
            <ResultDisplay label="Near Limit" value={nearLimit.toFixed(2)} unit="m" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Focus Zone</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="hfGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#hfGrid)" rx="8" />
              {/* Camera */}
              <path d={wobblyRect(15, 25, 25, 20)} fill="#78716c" fillOpacity="0.3" stroke="#57534e" strokeWidth="2" />
              {/* In-focus zone from H/2 to infinity */}
              <path d={wobblyRect(45 + Math.min(100, nearLimit * 10), 25, 120 - Math.min(100, nearLimit * 10), 20)} fill="#22c55e" fillOpacity="0.15" stroke="#16a34a" strokeWidth="1.5" />
              <text x="90" y="60" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#16a34a" fontWeight="bold">H = {H.toFixed(1)}m, ∞ focus from {nearLimit.toFixed(1)}m</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}