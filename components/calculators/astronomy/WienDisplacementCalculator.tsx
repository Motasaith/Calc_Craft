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

export default function WienDisplacementCalculator() {
  const [temp, setTemp] = useState('5778')
  const b = 2.898e-3 // Wien's constant in m·K

  const t = parseFloat(temp)
  const valid = !isNaN(t) && t > 0
  const peakWavelength = valid ? b / t : 0 // in meters
  const peakNm = valid ? peakWavelength * 1e9 : 0

  return (
    <FormCalculatorShell title="Wien's Displacement Law" subtitle="λmax = b / T" badge="ASTRONOMY">
      <RetroInput label="Temperature (T)" value={temp} onChange={setTemp} placeholder="5778" id="wn-t" unit="K" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Peak Wavelength" value={peakNm.toFixed(2)} unit="nm" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Blackbody Curve</span>
            <svg width="180" height="90" viewBox="0 0 180 90" className="select-none">
              <defs>
                <pattern id="wnGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="90" fill="url(#wnGrid)" rx="8" />
              <path d="M 25 80 L 25 15" stroke="#6b7280" strokeWidth="1.5" />
              <path d="M 25 80 L 165 80" stroke="#6b7280" strokeWidth="1.5" />
              {/* Blackbody curve (simplified) */}
              {(() => {
                const steps = 30
                let path = `M 25 80`
                for (let i = 1; i <= steps; i++) {
                  const x = 25 + (i / steps) * 140
                  const peak = 0.3 + (i / steps) * 0.4
                  const y = 80 - Math.exp(-Math.pow((i / steps - peak) * 3, 2)) * 60
                  path += ` L ${x} ${y}`
                }
                return <path d={path} fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
              })()}
              {/* Peak marker */}
              <circle cx={25 + 0.3 * 140 + 0.4 * 140 * 0.5} cy={80 - Math.exp(-Math.pow(0.5 * 3, 2)) * 60} r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <text x="90" y="12" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">λmax = {peakNm.toFixed(0)} nm</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}