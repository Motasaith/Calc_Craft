'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ExcavationCalculator() {
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('5')
  const [depth, setDepth] = useState('1.5')
  const [result, setResult] = useState<{ cubicYards: number; truckLoads: number } | null>(null)

  const calculate = () => {
    const l = parseFloat(length), w = parseFloat(width), d = parseFloat(depth)
    if (isNaN(l) || isNaN(w) || isNaN(d) || l <= 0 || w <= 0 || d <= 0) { setResult(null); return }
    const cubicMeters = l * w * d
    const cubicYards = cubicMeters * 1.30795
    const truckLoads = Math.ceil(cubicYards / 10)
    setResult({ cubicYards, truckLoads })
  }

  return (
    <FormCalculatorShell title="Excavation Calculator" subtitle="Volume & truck loads" badge="CONSTRUCTION">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Length (m)" value={length} onChange={setLength} placeholder="10" id="exc-l" />
        <RetroInput label="Width (m)" value={width} onChange={setWidth} placeholder="5" id="exc-w" />
      </div>
      <RetroInput label="Depth (m)" value={depth} onChange={setDepth} placeholder="1.5" id="exc-d" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <ResultDisplay label="Cubic Yards" value={result.cubicYards.toFixed(2)} unit="yd³" large />
            <ResultDisplay label="Truck Loads" value={result.truckLoads} />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 70" className="w-full h-20 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              <path d={wobblyBar(20, 15, 160, 45)} fill="#8a6040" stroke="#5a4030" strokeWidth="0.5" />
              <path d="M 20 15 L 40 5 L 200 5 L 180 15 Z" fill="#a08060" stroke="#5a4030" strokeWidth="0.5" />
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}