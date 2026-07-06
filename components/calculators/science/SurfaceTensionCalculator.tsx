'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(points: [number, number][]) {
  return 'M ' + points.map(([x, y]) => `${x} ${y}`).join(' L ')
}

export default function SurfaceTensionCalculator() {
  const [gamma, setGamma] = useState('0.0728')
  const [length, setLength] = useState('0.05')

  const G = parseFloat(gamma)
  const L = parseFloat(length)
  const valid = !isNaN(G) && !isNaN(L) && G > 0 && L > 0

  // F = gamma * L  (force along a line on a liquid surface)
  const F = valid ? G * L : 0

  // Visualizer: surface line with force arrow
  const w = Math.min(180, Math.max(20, L * 1000))

  return (
    <FormCalculatorShell
      title="Surface Tension"
      subtitle="F = γ · L"
      badge="SCIENCE"
    >
      <div>
        <RetroInput label="Surface Tension Coeff." value={gamma} onChange={setGamma} unit="N/m" placeholder="e.g. 0.0728" step={0.0001} />
        <RetroInput label="Length" value={length} onChange={setLength} unit="m" placeholder="e.g. 0.05" step={0.001} />
      </div>

      {valid && (
        <div className="grid grid-cols-1 gap-2 mb-3">
          <ResultDisplay label="Surface Tension Force" value={F.toFixed(5)} unit="N" large />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 bg-[#f4f1ea] rounded-lg border border-neutral-300">
        <path d={wobblyLine([[100 - w / 2, 40], [100 + w / 2, 40]])} fill="none" stroke="#4a6fa5" strokeWidth="2" />
        <path d={wobblyLine([[100, 30], [100, 50]])} fill="none" stroke="#ab3232" strokeWidth="2" />
        <text x="100" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#555">surface line</text>
      </svg>
    </FormCalculatorShell>
  )
}