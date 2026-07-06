'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function HeatTransferCalculator() {
  const [k, setK] = useState('0.04')
  const [area, setArea] = useState('10')
  const [thickness, setThickness] = useState('0.05')
  const [dT, setDT] = useState('20')

  const K = parseFloat(k)
  const A = parseFloat(area)
  const d = parseFloat(thickness)
  const T = parseFloat(dT)
  const valid = !isNaN(K) && !isNaN(A) && !isNaN(d) && !isNaN(T) && d > 0

  // Q = k * A * dT / d
  const Q = valid ? (K * A * T) / d : 0

  // Visualizer: heat flow bar
  const h = Math.min(60, (Q / 100) * 60)

  return (
    <FormCalculatorShell
      title="Heat Transfer (Conduction)"
      subtitle="Q = k · A · ΔT / d"
      badge="SCIENCE"
    >
      <div>
        <RetroInput label="Thermal Conductivity" value={k} onChange={setK} unit="W/m·K" placeholder="e.g. 0.04" step={0.001} />
        <RetroInput label="Area" value={area} onChange={setArea} unit="m²" placeholder="e.g. 10" />
        <RetroInput label="Thickness" value={thickness} onChange={setThickness} unit="m" placeholder="e.g. 0.05" step={0.001} />
        <RetroInput label="Temp Difference" value={dT} onChange={setDT} unit="°C" placeholder="e.g. 20" />
      </div>

      {valid && (
        <div className="grid grid-cols-1 gap-2 mb-3">
          <ResultDisplay label="Heat Transfer Rate" value={Q.toFixed(2)} unit="W" large />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 bg-[#f4f1ea] rounded-lg border border-neutral-300">
        <path d={wobblyBar(80, 70 - h, 40, h)} fill="#ab3232" opacity={0.85} />
        <text x="100" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#555">heat flow</text>
      </svg>
    </FormCalculatorShell>
  )
}