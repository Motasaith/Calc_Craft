'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function AdjustedBodyWeightCalculator() {
  const [actual, setActual] = useState('')
  const [ideal, setIdeal] = useState('')

  const a = parseFloat(actual), i = parseFloat(ideal)
  const valid = !isNaN(a) && !isNaN(i) && a > 0 && i > 0
  const adj = valid ? i + 0.4 * (a - i) : 0

  const barWidth = valid ? Math.min(adj / 150, 1) * 180 : 0

  return (
    <FormCalculatorShell title="Adjusted Body Weight" subtitle="For obese patients dosing" badge="HEALTH">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Actual Weight" value={actual} onChange={setActual} placeholder="100" id="abw-a" unit="kg" min={20} max={400} />
        <RetroInput label="Ideal Weight" value={ideal} onChange={setIdeal} placeholder="70" id="abw-i" unit="kg" min={20} max={200} />
      </div>

      {valid && (
        <>
          <div className="mt-2">
            <ResultDisplay label="Adjusted Body Weight" value={adj.toFixed(1)} unit="kg" large />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(10, 25, barWidth, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="8" fontFamily="monospace" fill="#555">0 kg</text>
            <text x="155" y="18" fontSize="8" fontFamily="monospace" fill="#555">150 kg</text>
          </svg>
          <p className="text-[9px] text-neutral-500 font-mono mt-2">AdjBW = IBW + 0.4 × (Actual - IBW). Used for drug dosing in obesity.</p>
        </>
      )}
    </FormCalculatorShell>
  )
}