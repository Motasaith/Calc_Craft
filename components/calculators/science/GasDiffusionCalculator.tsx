'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function GasDiffusionCalculator() {
  const [m1, setM1] = useState('2')
  const [m2, setM2] = useState('32')

  const M1 = parseFloat(m1)
  const M2 = parseFloat(m2)
  const valid = !isNaN(M1) && !isNaN(M2) && M1 > 0 && M2 > 0

  // Graham's law: rate1 / rate2 = sqrt(M2 / M1)
  const ratio = valid ? Math.sqrt(M2 / M1) : 0

  // Visualizer: two bars representing relative diffusion rates
  const r1 = 1
  const r2 = valid ? 1 / ratio : 0
  const maxR = Math.max(r1, r2, 1)
  const h1 = (r1 / maxR) * 60
  const h2 = (r2 / maxR) * 60

  return (
    <FormCalculatorShell
      title="Gas Diffusion (Graham's Law)"
      subtitle="rate₁ / rate₂ = √(M₂ / M₁)"
      badge="SCIENCE"
    >
      <div>
        <RetroInput label="Molar Mass Gas 1" value={m1} onChange={setM1} unit="g/mol" placeholder="e.g. 2" />
        <RetroInput label="Molar Mass Gas 2" value={m2} onChange={setM2} unit="g/mol" placeholder="e.g. 32" />
      </div>

      {valid && (
        <div className="grid grid-cols-1 gap-2 mb-3">
          <ResultDisplay label="Rate Ratio (1 : 2)" value={ratio.toFixed(4)} large />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 bg-[#f4f1ea] rounded-lg border border-neutral-300">
        <path d={wobblyBar(40, 70 - h1, 40, h1)} fill="#dfaa44" opacity={0.85} />
        <path d={wobblyBar(120, 70 - h2, 40, h2)} fill="#4a6fa5" opacity={0.85} />
        <text x="60" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#555">gas 1</text>
        <text x="140" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#555">gas 2</text>
      </svg>
    </FormCalculatorShell>
  )
}