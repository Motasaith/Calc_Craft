'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ScreedCalculator() {
  const [area, setArea] = useState('30')
  const [thickness, setThickness] = useState('50')
  const [result, setResult] = useState<{ volume: number; cementBags: number; sand: number } | null>(null)

  const calculate = () => {
    const a = parseFloat(area), t = parseFloat(thickness)
    if (isNaN(a) || isNaN(t) || a <= 0 || t <= 0) { setResult(null); return }
    const volume = a * (t / 1000)
    const dryVolume = volume * 1.4
    const cementVol = dryVolume / 4
    const sandVol = (dryVolume * 3) / 4
    const cementBags = Math.ceil((cementVol * 1440) / 50)
    const sand = sandVol * 1600
    setResult({ volume, cementBags, sand })
  }

  return (
    <FormCalculatorShell title="Screed Calculator" subtitle="Floor screed materials" badge="CONSTRUCTION">
      <RetroInput label="Area (m²)" value={area} onChange={setArea} placeholder="30" id="sc-area" />
      <RetroInput label="Thickness (mm)" value={thickness} onChange={setThickness} placeholder="50" id="sc-thk" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <ResultDisplay label="Volume" value={result.volume.toFixed(2)} unit="m³" />
            <ResultDisplay label="Cement Bags" value={result.cementBags} large />
            <ResultDisplay label="Sand" value={result.sand.toFixed(0)} unit="kg" />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 60" className="w-full h-16 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              <path d={wobblyBar(10, 25, 180, 20)} fill="#d0c8b0" stroke="#807060" strokeWidth="0.5" />
              <path d={wobblyBar(10, 20, 180, 6)} fill="#a0a0a0" stroke="#606060" strokeWidth="0.5" />
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}