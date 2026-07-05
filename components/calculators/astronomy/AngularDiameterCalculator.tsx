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

export default function AngularDiameterCalculator() {
  const [diameter, setDiameter] = useState('1392700')
  const [distance, setDistance] = useState('1.496e11')

  const d = parseFloat(diameter), dist = parseFloat(distance)
  const valid = !isNaN(d) && !isNaN(dist) && dist > 0
  const angleRad = valid ? 2 * Math.atan(d / (2 * dist)) : 0
  const angleDeg = valid ? angleRad * (180 / Math.PI) : 0
  const angleArcmin = valid ? angleDeg * 60 : 0

  return (
    <FormCalculatorShell title="Angular Diameter" subtitle="δ = 2 × arctan(d / 2D)" badge="ASTRONOMY">
      <RetroInput label="Object Diameter (d)" value={diameter} onChange={setDiameter} placeholder="1392700" id="ad-d" unit="km" />
      <RetroInput label="Distance (D)" value={distance} onChange={setDistance} placeholder="1.496e11" id="ad-dist" unit="km" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Angular Size" value={angleDeg.toFixed(4)} unit="°" large />
            <ResultDisplay label="Arcminutes" value={angleArcmin.toFixed(2)} unit="'" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Angular Size</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="adGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#adGrid)" rx="8" />
              {/* Observer */}
              <circle cx="20" cy="40" r="4" fill="#4c5c4a" />
              {/* Angle lines */}
              <path d={`M 20 40 L 160 ${40 - Math.min(25, angleDeg) * 2}`} stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
              <path d={`M 20 40 L 160 ${40 + Math.min(25, angleDeg) * 2}`} stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
              {/* Object */}
              <path d={wobblyCircle(155, 40, Math.min(15, Math.max(3, angleDeg * 2)))} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" />
              <text x="90" y="72" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">δ = {angleDeg.toFixed(2)}°</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}