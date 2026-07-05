'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function RoofPitchCalculator() {
  const [run, setRun] = useState('4')
  const [rise, setRise] = useState('2')
  const [buildingLength, setBuildingLength] = useState('10')
  const [result, setResult] = useState<{ pitchRatio: string; angle: number; roofArea: number } | null>(null)

  const calculate = () => {
    const r = parseFloat(run), ri = parseFloat(rise), bl = parseFloat(buildingLength)
    if (isNaN(r) || isNaN(ri) || isNaN(bl) || r <= 0 || ri <= 0 || bl <= 0) { setResult(null); return }
    const slope = Math.sqrt(r * r + ri * ri)
    const angle = Math.atan(ri / r) * (180 / Math.PI)
    const roofArea = slope * bl * 2
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
    const g = gcd(Math.round(ri), Math.round(r))
    setResult({ pitchRatio: `${Math.round(ri) / g}:${Math.round(r) / g}`, angle, roofArea })
  }

  return (
    <FormCalculatorShell title="Roof Pitch Calculator" subtitle="Pitch, angle & area" badge="CONSTRUCTION">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Run (m)" value={run} onChange={setRun} placeholder="4" id="rp-run" />
        <RetroInput label="Rise (m)" value={rise} onChange={setRise} placeholder="2" id="rp-rise" />
      </div>
      <RetroInput label="Building Length (m)" value={buildingLength} onChange={setBuildingLength} placeholder="10" id="rp-bl" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <ResultDisplay label="Pitch" value={result.pitchRatio} />
            <ResultDisplay label="Angle" value={result.angle.toFixed(1)} unit="°" />
            <ResultDisplay label="Roof Area" value={result.roofArea.toFixed(1)} unit="m²" large />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 70" className="w-full h-20 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              <path d="M 20 60 L 100 15 L 180 60 Z" fill="#a06050" stroke="#603020" strokeWidth="1" />
              <path d={wobblyBar(20, 60, 160, 8)} fill="#604030" stroke="#403020" strokeWidth="0.5" />
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}