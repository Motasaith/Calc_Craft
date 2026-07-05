'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function SidingCalculator() {
  const [wallArea, setWallArea] = useState('150')
  const [exposure, setExposure] = useState('180')
  const [result, setResult] = useState<{ squares: number; pieces: number } | null>(null)

  const calculate = () => {
    const wa = parseFloat(wallArea), ex = parseFloat(exposure)
    if (isNaN(wa) || isNaN(ex) || wa <= 0 || ex <= 0) { setResult(null); return }
    const squares = Math.ceil((wa / 9.29) * 1.1)
    const pieceArea = (ex / 1000) * 3.66
    const pieces = Math.ceil((wa * 1.1) / pieceArea)
    setResult({ squares, pieces })
  }

  return (
    <FormCalculatorShell title="Siding Calculator" subtitle="Squares needed for walls" badge="CONSTRUCTION">
      <RetroInput label="Wall Area (m²)" value={wallArea} onChange={setWallArea} placeholder="150" id="sid-wa" />
      <RetroInput label="Siding Exposure (mm)" value={exposure} onChange={setExposure} placeholder="180" id="sid-ex" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <ResultDisplay label="Squares" value={result.squares} large />
            <ResultDisplay label="Pieces" value={result.pieces} />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 70" className="w-full h-20 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              {Array.from({ length: 6 }).map((_, i) => (
                <path key={i} d={wobblyBar(5, 8 + i * 10, 190, 8)} fill="#a08060" stroke="#604030" strokeWidth="0.5" />
              ))}
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}