'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CementMortarCalculator() {
  const [area, setArea] = useState('10')
  const [thickness, setThickness] = useState('20')
  const [mixRatio, setMixRatio] = useState<'1:3' | '1:4' | '1:5'>('1:4')
  const [result, setResult] = useState<{ cementBags: number; sand: number } | null>(null)

  const ratioParts: Record<string, { cement: number; sand: number }> = {
    '1:3': { cement: 1, sand: 3 },
    '1:4': { cement: 1, sand: 4 },
    '1:5': { cement: 1, sand: 5 },
  }

  const calculate = () => {
    const a = parseFloat(area), t = parseFloat(thickness)
    if (isNaN(a) || isNaN(t) || a <= 0 || t <= 0) { setResult(null); return }
    const volume = a * (t / 1000)
    const dryVolume = volume * 1.33
    const parts = ratioParts[mixRatio]
    const totalParts = parts.cement + parts.sand
    const cementVol = (dryVolume * parts.cement) / totalParts
    const sandVol = (dryVolume * parts.sand) / totalParts
    const cementBags = Math.ceil((cementVol * 1440) / 50)
    const sand = sandVol * 1600
    setResult({ cementBags, sand })
  }

  return (
    <FormCalculatorShell title="Cement Mortar Calculator" subtitle="Cement bags & sand needed" badge="CONSTRUCTION">
      <RetroInput label="Area (m²)" value={area} onChange={setArea} placeholder="10" id="cm-area" />
      <RetroInput label="Thickness (mm)" value={thickness} onChange={setThickness} placeholder="20" id="cm-thk" />
      <RetroSelect label="Mix Ratio" value={mixRatio} onChange={(v) => { setMixRatio(v as any); setResult(null) }} options={[{value:'1:3',label:'1:3 (Rich)'},{value:'1:4',label:'1:4 (Standard)'},{value:'1:5',label:'1:5 (Lean)'}]} id="cm-ratio" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <ResultDisplay label="Cement Bags" value={result.cementBags} large />
            <ResultDisplay label="Sand" value={result.sand.toFixed(0)} unit="kg" />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 60" className="w-full h-16 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              {Array.from({ length: 4 }).map((_, i) => (
                <path key={i} d={wobblyBar(15 + i * 45, 15, 35, 35)} fill="#c8c0a0" stroke="#807060" strokeWidth="0.5" />
              ))}
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}