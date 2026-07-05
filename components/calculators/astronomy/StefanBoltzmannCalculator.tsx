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

export default function StefanBoltzmannCalculator() {
  const [temp, setTemp] = useState('5778')
  const [radius, setRadius] = useState('6.96e8')
  const sigma = 5.67e-8

  const t = parseFloat(temp), r = parseFloat(radius)
  const valid = !isNaN(t) && !isNaN(r) && t > 0 && r > 0
  const power = valid ? 4 * Math.PI * r * r * sigma * Math.pow(t, 4) : 0

  return (
    <FormCalculatorShell title="Stefan-Boltzmann Law" subtitle="P = 4πR²σT⁴" badge="ASTRONOMY">
      <RetroInput label="Temperature (T)" value={temp} onChange={setTemp} placeholder="5778" id="sb-t" unit="K" />
      <RetroInput label="Radius (R)" value={radius} onChange={setRadius} placeholder="6.96e8" id="sb-r" unit="m" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Radiated Power" value={power.toExponential(4)} unit="W" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Star Radiation</span>
            <svg width="140" height="100" viewBox="0 0 140 100" className="select-none">
              <defs>
                <pattern id="sbGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="100" fill="url(#sbGrid)" rx="8" />
              <path d={wobblyCircle(70, 50, 18)} fill={t > 7000 ? '#60a5fa' : t > 5000 ? '#fbbf24' : '#ef4444'} fillOpacity="0.3" stroke={t > 7000 ? '#2563eb' : t > 5000 ? '#d97706' : '#dc2626'} strokeWidth="2" />
              {/* Radiation lines */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                const rad = (deg * Math.PI) / 180
                return <path key={deg} d={`M ${70 + 20 * Math.cos(rad)} ${50 + 20 * Math.sin(rad)} L ${70 + 35 * Math.cos(rad)} ${50 + 35 * Math.sin(rad)}`} stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
              })}
              <text x="70" y="95" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#d97706" fontWeight="bold">P = {power.toExponential(2)} W</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}