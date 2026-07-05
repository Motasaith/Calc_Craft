'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(points: [number, number][]) {
  return 'M ' + points.map(([x, y]) => `${x} ${y}`).join(' L ')
}

export default function RefractiveIndexCalculator() {
  const [incAngle, setIncAngle] = useState('45')
  const [refAngle, setRefAngle] = useState('30')

  const i = parseFloat(incAngle)
  const r = parseFloat(refAngle)
  const valid = !isNaN(i) && !isNaN(r) && i > 0 && r > 0 && i < 90 && r < 90

  // Snell: n1 sin(i) = n2 sin(r); assume n1 = 1 (vacuum/air)
  const n = valid ? Math.sin((i * Math.PI) / 180) / Math.sin((r * Math.PI) / 180) : 0

  // Visualizer: incident ray and refracted ray
  const ix = 100 - Math.sin((i * Math.PI) / 180) * 30
  const iy = 10
  const rx = 100 + Math.sin((r * Math.PI) / 180) * 30
  const ry = 70

  return (
    <FormCalculatorShell
      title="Refractive Index"
      subtitle="Snell's law: n = sin(i) / sin(r)"
      badge="SCIENCE"
    >
      <div>
        <RetroInput label="Angle of Incidence" value={incAngle} onChange={setIncAngle} unit="°" placeholder="e.g. 45" />
        <RetroInput label="Angle of Refraction" value={refAngle} onChange={setRefAngle} unit="°" placeholder="e.g. 30" />
      </div>

      {valid && (
        <div className="grid grid-cols-1 gap-2 mb-3">
          <ResultDisplay label="Refractive Index (n)" value={n.toFixed(4)} large />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 bg-[#f4f1ea] rounded-lg border border-neutral-300">
        <line x1="0" y1="40" x2="200" y2="40" stroke="#bbb" strokeDasharray="3 3" />
        <path d={wobblyLine([[ix, iy], [100, 40]])} fill="none" stroke="#dfaa44" strokeWidth="2" />
        <path d={wobblyLine([[100, 40], [rx, ry]])} fill="none" stroke="#4a6fa5" strokeWidth="2" />
        <text x="100" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#555">boundary</text>
      </svg>
    </FormCalculatorShell>
  )
}