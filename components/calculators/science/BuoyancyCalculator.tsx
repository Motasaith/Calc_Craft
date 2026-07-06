'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  const pts: string[] = []
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI * 2
    const rr = r + Math.sin(a * 3) * 1.5
    pts.push(`${cx + rr * Math.cos(a)} ${cy + rr * Math.sin(a)}`)
  }
  return 'M ' + pts.join(' L ') + ' Z'
}

export default function BuoyancyCalculator() {
  const [density, setDensity] = useState('1000')
  const [volume, setVolume] = useState('0.5')
  const [g, setG] = useState('9.81')

  const rho = parseFloat(density)
  const V = parseFloat(volume)
  const G = parseFloat(g)
  const valid = !isNaN(rho) && !isNaN(V) && !isNaN(G) && rho > 0 && V > 0

  // F = rho * V * g
  const F = valid ? rho * V * G : 0

  // Visualizer: object partially submerged
  const r = Math.min(25, Math.max(8, V * 20))

  return (
    <FormCalculatorShell
      title="Buoyancy Force"
      subtitle="F = ρ · V · g"
      badge="SCIENCE"
    >
      <div>
        <RetroInput label="Fluid Density" value={density} onChange={setDensity} unit="kg/m³" placeholder="e.g. 1000" />
        <RetroInput label="Volume Displaced" value={volume} onChange={setVolume} unit="m³" placeholder="e.g. 0.5" step={0.01} />
        <RetroInput label="Gravity" value={g} onChange={setG} unit="m/s²" placeholder="e.g. 9.81" step={0.001} />
      </div>

      {valid && (
        <div className="grid grid-cols-1 gap-2 mb-3">
          <ResultDisplay label="Buoyant Force" value={F.toFixed(2)} unit="N" large />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 bg-[#f4f1ea] rounded-lg border border-neutral-300">
        <rect x="0" y="40" width="200" height="40" fill="#4a6fa5" opacity={0.25} />
        <path d={wobblyCircle(100, 40, r)} fill="#dfaa44" opacity={0.85} />
        <text x="100" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#555">fluid surface</text>
      </svg>
    </FormCalculatorShell>
  )
}