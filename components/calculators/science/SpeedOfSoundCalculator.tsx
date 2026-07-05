'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(points: [number, number][]) {
  return 'M ' + points.map(([x, y]) => `${x} ${y}`).join(' L ')
}

export default function SpeedOfSoundCalculator() {
  const [temp, setTemp] = useState('20')

  const T = parseFloat(temp)
  const valid = !isNaN(T)

  // v = 331.3 + 0.606 * T  (m/s)
  const vMs = valid ? 331.3 + 0.606 * T : 0
  const vKmh = vMs * 3.6
  const vMph = vMs * 2.23694

  // Visualizer: wobbly wave whose wavelength scales with speed
  const pts: [number, number][] = []
  const cycles = Math.max(1, vMs / 100)
  for (let i = 0; i <= 40; i++) {
    const x = (i / 40) * 190 + 5
    const y = 40 + Math.sin((i / 40) * cycles * Math.PI * 2) * 20
    pts.push([x, y])
  }

  return (
    <FormCalculatorShell
      title="Speed of Sound"
      subtitle="Speed of sound in air from temperature"
      badge="SCIENCE"
    >
      <div>
        <RetroInput label="Temperature" value={temp} onChange={setTemp} unit="°C" placeholder="e.g. 20" />
      </div>

      {valid && (
        <div className="grid grid-cols-1 gap-2 mb-3">
          <ResultDisplay label="Speed (m/s)" value={vMs.toFixed(2)} unit="m/s" large />
          <ResultDisplay label="Speed (km/h)" value={vKmh.toFixed(2)} unit="km/h" />
          <ResultDisplay label="Speed (mph)" value={vMph.toFixed(2)} unit="mph" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 bg-[#f4f1ea] rounded-lg border border-neutral-300">
        <path d={wobblyLine(pts)} fill="none" stroke="#4a6fa5" strokeWidth="2" />
        <text x="100" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#555">
          sound wave
        </text>
      </svg>
    </FormCalculatorShell>
  )
}