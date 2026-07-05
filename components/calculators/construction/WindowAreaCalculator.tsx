'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function WindowAreaCalculator() {
  const [floorArea, setFloorArea] = useState('25')
  const [ratio, setRatio] = useState('0.15')
  const [result, setResult] = useState<{ windowArea: number; numWindows: number } | null>(null)

  const calculate = () => {
    const fa = parseFloat(floorArea), r = parseFloat(ratio)
    if (isNaN(fa) || isNaN(r) || fa <= 0 || r <= 0) { setResult(null); return }
    const windowArea = fa * r
    const numWindows = Math.ceil(windowArea / 1.5)
    setResult({ windowArea, numWindows })
  }

  return (
    <FormCalculatorShell title="Window Area Calculator" subtitle="Recommended window area" badge="CONSTRUCTION">
      <RetroInput label="Room Floor Area (m²)" value={floorArea} onChange={setFloorArea} placeholder="25" id="wa-fa" />
      <RetroInput label="Window-to-Floor Ratio" value={ratio} onChange={setRatio} placeholder="0.15" step={0.01} id="wa-r" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <ResultDisplay label="Window Area" value={result.windowArea.toFixed(2)} unit="m²" large />
            <ResultDisplay label="Est. Windows" value={result.numWindows} />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 70" className="w-full h-20 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              <path d={wobblyBar(40, 10, 120, 50)} fill="#d8d0c0" stroke="#807060" strokeWidth="1" />
              <path d={wobblyBar(55, 20, 30, 30)} fill="#a0c8e0" stroke="#506070" strokeWidth="0.5" />
              <path d={wobblyBar(115, 20, 30, 30)} fill="#a0c8e0" stroke="#506070" strokeWidth="0.5" />
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}