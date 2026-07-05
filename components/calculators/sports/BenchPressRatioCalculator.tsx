'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function BenchPressRatioCalculator() {
  const [weight, setWeight] = useState('75')
  const [bench, setBench] = useState('100')

  const bw = parseFloat(weight), bp = parseFloat(bench)
  const valid = !isNaN(bw) && !isNaN(bp) && bw > 0 && bp > 0
  const ratio = valid ? bp / bw : 0
  const strengthLevel = valid ? (ratio > 2 ? 'Elite' : ratio > 1.5 ? 'Advanced' : ratio > 1.25 ? 'Intermediate' : ratio > 1 ? 'Novice' : 'Beginner') : ''

  return (
    <FormCalculatorShell title="Bench Press Ratio" subtitle="Ratio = Bench / Body Weight" badge="SPORTS">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Body Weight" value={weight} onChange={setWeight} placeholder="75" id="bp-bw" unit="kg" />
        <RetroInput label="Bench Press" value={bench} onChange={setBench} placeholder="100" id="bp-bp" unit="kg" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Strength Ratio" value={ratio.toFixed(2)} unit="×BW" large />
            <ResultDisplay label="Level" value={strengthLevel} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Strength Level</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="bpGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#bpGrid)" rx="8" />
              <path d={wobblyBar(15, 25, 150, 25)} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" rx="3" />
              <path d={wobblyBar(15, 25, Math.min(150, (ratio / 2.5) * 150), 25)} fill="#f97316" fillOpacity="0.4" stroke="#ea580c" strokeWidth="1.5" rx="3" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ea580c" fontWeight="bold">{ratio.toFixed(2)}× BW — {strengthLevel}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}