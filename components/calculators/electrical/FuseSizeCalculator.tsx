'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function FuseSizeCalculator() {
  const [loadCurrent, setLoadCurrent] = useState('10')
  const [margin, setMargin] = useState('25')

  const amps = parseFloat(loadCurrent) || 0
  const marginPct = parseFloat(margin) || 0

  const rawFuse = amps * (1 + marginPct / 100)
  // Round up to nearest standard fuse size
  const standardSizes = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100]
  const recommended = standardSizes.find((s) => s >= rawFuse) ?? Math.ceil(rawFuse)

  const valid = amps > 0 && marginPct >= 0

  const barH = Math.min(80, recommended * 0.8)

  return (
    <FormCalculatorShell
      title="Fuse Size Calculator"
      subtitle="Pick the right fuse for your circuit"
      badge="ELECTRICAL"
    >
      <div>
        <RetroInput label="Load Current" value={loadCurrent} onChange={setLoadCurrent} unit="A" min={0} />
        <RetroInput label="Safety Margin" value={margin} onChange={setMargin} unit="%" min={0} />
      </div>

      <div className="space-y-2 mt-2">
        {valid && (
          <>
            <ResultDisplay label="Recommended Fuse" value={recommended} unit="A" large />
            <ResultDisplay label="Calculated Size" value={rawFuse.toFixed(2)} unit="A" />
          </>
        )}
      </div>

      {valid && (
        <div className="mt-3 flex justify-center">
          <svg width="120" height="100" viewBox="0 0 120 100">
            <path d={wobblyBar(20, 90 - barH, 30, barH)} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(60, 90 - barH * 0.8, 30, barH * 0.8)} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <line x1="10" y1="90" x2="110" y2="90" stroke="#888" strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}