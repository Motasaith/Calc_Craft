'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(points: [number, number][]) {
  return 'M ' + points.map(([x, y]) => `${x} ${y}`).join(' L ')
}

export default function SnellsLawCalculator() {
  const [incAngle, setIncAngle] = useState('30')
  const [n1, setN1] = useState('1.00')
  const [n2, setN2] = useState('1.50')

  const i = parseFloat(incAngle)
  const N1 = parseFloat(n1)
  const N2 = parseFloat(n2)
  const valid = !isNaN(i) && !isNaN(N1) && !isNaN(N2) && i > 0 && i < 90 && N1 > 0 && N2 > 0

  // n1 sin(i) = n2 sin(r) => r = asin(n1/n2 * sin(i))
  const sinR = valid ? (N1 / N2) * Math.sin((i * Math.PI) / 180) : 0
  const totalInternal = valid && sinR > 1
  const r = valid && !totalInternal ? (Math.asin(sinR) * 180) / Math.PI : 0
  // critical angle: asin(n2/n1) when n1 > n2
  const critical = valid && N1 > N2 ? (Math.asin(N2 / N1) * 180) / Math.PI : null

  // Visualizer
  const ix = 100 - Math.sin((i * Math.PI) / 180) * 30
  const iy = 10
  const rx = 100 + (valid && !totalInternal ? Math.sin((r * Math.PI) / 180) * 30 : 0)
  const ry = 70

  return (
    <FormCalculatorShell
      title="Snell's Law"
      subtitle="Refraction angle & critical angle"
      badge="SCIENCE"
    >
      <div>
        <RetroInput label="Incident Angle" value={incAngle} onChange={setIncAngle} unit="°" placeholder="e.g. 30" />
        <RetroInput label="n₁ (medium 1)" value={n1} onChange={setN1} placeholder="e.g. 1.00" step="0.01" />
        <RetroInput label="n₂ (medium 2)" value={n2} onChange={setN2} placeholder="e.g. 1.50" step="0.01" />
      </div>

      {valid && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <ResultDisplay
            label="Refraction Angle"
            value={totalInternal ? 'TIR' : r.toFixed(2)}
            unit={totalInternal ? '' : '°'}
            large
          />
          <ResultDisplay
            label="Critical Angle"
            value={critical === null ? 'n/a' : critical.toFixed(2)}
            unit={critical === null ? '' : '°'}
          />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 bg-[#f4f1ea] rounded-lg border border-neutral-300">
        <line x1="0" y1="40" x2="200" y2="40" stroke="#bbb" strokeDasharray="3 3" />
        <path d={wobblyLine([[ix, iy], [100, 40]])} fill="none" stroke="#dfaa44" strokeWidth="2" />
        {!totalInternal && (
          <path d={wobblyLine([[100, 40], [rx, ry]])} fill="none" stroke="#4a6fa5" strokeWidth="2" />
        )}
        <text x="100" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#555">boundary</text>
      </svg>
    </FormCalculatorShell>
  )
}