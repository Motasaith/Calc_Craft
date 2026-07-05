'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  const steps = 28
  let path = ''
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2
    const jitter = (Math.sin(i * 3.1) - 0.5) * 1.0
    const x = cx + (r + jitter) * Math.cos(theta)
    const y = cy + (r + jitter) * Math.sin(theta)
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return path + ' Z'
}

export default function StellarLuminosityCalculator() {
  const [radius, setRadius] = useState('1')
  const [temp, setTemp] = useState('5778')
  const sigma = 5.67e-8

  const r = parseFloat(radius), t = parseFloat(temp)
  const valid = !isNaN(r) && !isNaN(t) && r >= 0 && t > 0
  // R in solar radii, T in K → L in solar luminosities
  const L = valid ? (4 * Math.PI * sigma * Math.pow(r * 6.96e8, 2) * Math.pow(t, 4)) : 0
  const L_solar = 3.828e26
  const L_ratio = valid ? L / L_solar : 0

  return (
    <FormCalculatorShell title="Stellar Luminosity" subtitle="L = 4πR²σT⁴" badge="ASTRONOMY">
      <RetroInput label="Radius (R)" value={radius} onChange={setRadius} placeholder="1" id="sl-r" unit="R☉" />
      <RetroInput label="Surface Temp (T)" value={temp} onChange={setTemp} placeholder="5778" id="sl-t" unit="K" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Luminosity" value={L_ratio.toFixed(4)} unit="L☉" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Star Size</span>
            <svg width="140" height="100" viewBox="0 0 140 100" className="select-none">
              <defs>
                <pattern id="slGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="100" fill="url(#slGrid)" rx="8" />
              {/* Sun reference */}
              <path d={wobblyCircle(35, 50, 10)} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="1.5" />
              <text x="35" y="80" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#78350f">Sun</text>
              {/* Target star (scales with radius) */}
              <path d={wobblyCircle(95, 50, Math.min(35, Math.max(5, r * 10)))} fill={t > 7000 ? '#60a5fa' : t > 5000 ? '#fbbf24' : '#ef4444'} fillOpacity="0.3" stroke={t > 7000 ? '#2563eb' : t > 5000 ? '#d97706' : '#dc2626'} strokeWidth="2" />
              <text x="95" y="80" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#6b7280">Star</text>
              <text x="70" y="95" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">L = {L_ratio.toFixed(2)} L☉</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}