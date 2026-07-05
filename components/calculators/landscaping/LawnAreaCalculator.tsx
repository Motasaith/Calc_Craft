'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`
}

export default function LawnAreaCalculator() {
  const [length, setLength] = useState('80')
  const [width, setWidth] = useState('60')
  const [shape, setShape] = useState('rectangle')

  const len = parseFloat(length) || 0
  const wid = parseFloat(width) || 0

  const areaSqFt = shape === 'rectangle' ? len * wid : shape === 'circle' ? Math.PI * (len / 2) ** 2 : (len * wid) / 2
  const areaSqM = areaSqFt * 0.092903

  const valid = len > 0 && (shape === 'circle' || wid > 0)

  return (
    <FormCalculatorShell
      title="Lawn Area Calculator"
      subtitle="Find lawn area from dimensions and shape"
      badge="LANDSCAPING"
    >
      <div>
        <RetroInput label={shape === 'circle' ? 'Diameter' : 'Length'} value={length} onChange={setLength} unit="ft" min={0} />
        {shape !== 'circle' && <RetroInput label="Width" value={width} onChange={setWidth} unit="ft" min={0} />}
        <div className="mb-3">
          <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
            Shape
          </label>
          <select
            value={shape}
            onChange={(e) => setShape(e.target.value)}
            className="w-full h-10 px-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500"
          >
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Area" value={areaSqFt.toFixed(1)} unit="sq ft" large />
          <ResultDisplay label="Area" value={areaSqM.toFixed(2)} unit="sq m" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <rect x="0" y="0" width="200" height="80" fill="#cde4c8" />
        {shape === 'rectangle' && <path d={wobblyCircle(100, 40, 30)} fill="#5a8a4a" opacity={valid ? 0.85 : 0.3} />}
        {shape === 'circle' && <path d={wobblyCircle(100, 40, 30)} fill="#5a8a4a" opacity={valid ? 0.85 : 0.3} />}
        {shape === 'triangle' && <path d="M 100 10 L 150 70 L 50 70 Z" fill="#5a8a4a" opacity={valid ? 0.85 : 0.3} />}
      </svg>
    </FormCalculatorShell>
  )
}