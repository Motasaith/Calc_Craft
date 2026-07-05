'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function WaistToHeightCalculator() {
  const [waist, setWaist] = useState('')
  const [height, setHeight] = useState('')

  const w = parseFloat(waist), h = parseFloat(height)
  const valid = !isNaN(w) && !isNaN(h) && w > 0 && h > 0 && w < 300 && h > 50 && h < 280
  const ratio = valid ? w / h : 0

  const getCategory = () => {
    if (!valid) return ''
    if (ratio < 0.34) return 'Underweight'
    if (ratio < 0.43) return 'Healthy'
    if (ratio < 0.53) return 'Overweight'
    return 'Obese'
  }

  const category = getCategory()
  const barWidth = valid ? Math.min(ratio / 0.6, 1) * 180 : 0

  return (
    <FormCalculatorShell title="Waist-to-Height Ratio" subtitle="Central obesity indicator" badge="HEALTH">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Waist" value={waist} onChange={setWaist} placeholder="80" id="whtr-w" unit="cm" min={30} max={200} />
        <RetroInput label="Height" value={height} onChange={setHeight} placeholder="170" id="whtr-h" unit="cm" min={50} max={280} />
      </div>

      {valid && (
        <>
          <div className="mt-2">
            <ResultDisplay label="Waist-to-Height Ratio" value={ratio.toFixed(2)} large />
          </div>
          <div className="mt-2">
            <ResultDisplay label="Category" value={category} />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(10, 25, barWidth, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="8" fontFamily="monospace" fill="#555">0.34</text>
            <text x="160" y="18" fontSize="8" fontFamily="monospace" fill="#555">0.53+</text>
          </svg>
        </>
      )}
    </FormCalculatorShell>
  )
}