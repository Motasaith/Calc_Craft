'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function GutterCalculator() {
  const [roofPerimeter, setRoofPerimeter] = useState('60')
  const [downspoutSpacing, setDownspoutSpacing] = useState('12')
  const [result, setResult] = useState<{ gutterLength: number; downspouts: number } | null>(null)

  const calculate = () => {
    const p = parseFloat(roofPerimeter), ds = parseFloat(downspoutSpacing)
    if (isNaN(p) || isNaN(ds) || p <= 0 || ds <= 0) { setResult(null); return }
    const gutterLength = p * 1.05
    const downspouts = Math.ceil(p / ds)
    setResult({ gutterLength, downspouts })
  }

  return (
    <FormCalculatorShell title="Gutter Calculator" subtitle="Gutter length & downspouts" badge="CONSTRUCTION">
      <RetroInput label="Roof Perimeter (m)" value={roofPerimeter} onChange={setRoofPerimeter} placeholder="60" id="gt-per" />
      <RetroInput label="Downspout Spacing (m)" value={downspoutSpacing} onChange={setDownspoutSpacing} placeholder="12" id="gt-ds" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <ResultDisplay label="Gutter Length" value={result.gutterLength.toFixed(1)} unit="m" large />
            <ResultDisplay label="Downspouts" value={result.downspouts} />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 60" className="w-full h-16 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              <path d={wobblyBar(10, 20, 180, 12)} fill="#808080" stroke="#505050" strokeWidth="0.5" />
              {Array.from({ length: 4 }).map((_, i) => (
                <path key={i} d={wobblyBar(40 + i * 45, 32, 8, 20)} fill="#606060" stroke="#404040" strokeWidth="0.5" />
              ))}
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}