'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function AsphaltCalculator() {
  const [area, setArea] = useState('100')
  const [thickness, setThickness] = useState('75')
  const [result, setResult] = useState<{ tons: number; volume: number } | null>(null)

  const calculate = () => {
    const a = parseFloat(area), t = parseFloat(thickness)
    if (isNaN(a) || isNaN(t) || a <= 0 || t <= 0) { setResult(null); return }
    const volume = a * (t / 1000)
    const tons = volume * 2.4
    setResult({ tons, volume })
  }

  return (
    <FormCalculatorShell title="Asphalt Calculator" subtitle="Tons needed for paving" badge="CONSTRUCTION">
      <RetroInput label="Area (m²)" value={area} onChange={setArea} placeholder="100" id="asp-area" />
      <RetroInput label="Thickness (mm)" value={thickness} onChange={setThickness} placeholder="75" id="asp-thk" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <ResultDisplay label="Tons Needed" value={result.tons.toFixed(2)} unit="t" large />
            <ResultDisplay label="Volume" value={result.volume.toFixed(2)} unit="m³" />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 60" className="w-full h-16 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              {Array.from({ length: 6 }).map((_, i) => (
                <path key={i} d={wobblyBar(10 + i * 30, 20, 25, 25)} fill="#3a3a3a" stroke="#1a1a1a" strokeWidth="0.5" />
              ))}
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}