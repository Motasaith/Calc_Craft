'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  const steps = 28
  let path = ''
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2
    const jitter = (Math.sin(i * 3.1) - 0.5) * 1.2
    const x = cx + (r + jitter) * Math.cos(theta)
    const y = cy + (r + jitter) * Math.sin(theta)
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return path + ' Z'
}

export default function DensityPhysicsCalculator() {
  const [mass, setMass] = useState('100')
  const [vol, setVol] = useState('50')

  const m = parseFloat(mass), v = parseFloat(vol)
  const valid = !isNaN(m) && !isNaN(v) && m >= 0 && v > 0
  const density = valid ? m / v : 0

  // Circle size scales with density
  const r = Math.min(40, Math.max(8, (density / 20) * 40))

  return (
    <FormCalculatorShell title="Density Calculator" subtitle="ρ = m / V" badge="PHYSICS">
      <RetroInput label="Mass (m)" value={mass} onChange={setMass} placeholder="e.g. 100" id="dn-m" unit="kg" />
      <RetroInput label="Volume (V)" value={vol} onChange={setVol} placeholder="e.g. 50" id="dn-v" unit="m³" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Density" value={density.toFixed(2)} unit="kg/m³" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Density Sphere</span>
            <svg width="140" height="120" viewBox="0 0 140 120" className="select-none">
              <defs>
                <pattern id="dnGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="120" fill="url(#dnGrid)" rx="8" />
              <path d={wobblyCircle(70, 55, r)} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" />
              <text x="70" y="105" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">ρ = {density.toFixed(1)} kg/m³</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}