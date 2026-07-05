'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(x: number, y: number, w: number) {
  return `M ${x} ${y} Q ${x + w / 2} ${y - 6} ${x + w} ${y}`
}

export default function GradeCurveCalculator() {
  const [raw, setRaw] = useState('72')
  const [highest, setHighest] = useState('88')
  const [target, setTarget] = useState('100')

  const r = parseFloat(raw)
  const h = parseFloat(highest)
  const t = parseFloat(target)

  const valid = !isNaN(r) && !isNaN(h) && !isNaN(t) && h > 0 && t > 0 && r >= 0

  // Linear curve: scale so highest maps to target
  const curved = valid ? Math.min(t, (r / h) * t) : 0
  const adjustment = valid ? curved - r : 0

  return (
    <FormCalculatorShell
      title="Grade Curve"
      subtitle="Adjust scores to a target max"
      badge="EDUCATION"
    >
      <div>
        <RetroInput label="Your Raw Score" value={raw} onChange={setRaw} unit="pts" />
        <RetroInput label="Highest in Class" value={highest} onChange={setHighest} unit="pts" />
        <RetroInput label="Target Max Score" value={target} onChange={setTarget} unit="pts" />
      </div>

      {valid && (
        <div className="space-y-2 mb-3">
          <ResultDisplay label="Curved Score" value={curved.toFixed(1)} unit="pts" large />
          <ResultDisplay label="Adjustment" value={(adjustment >= 0 ? '+' : '') + adjustment.toFixed(1)} unit="pts" />
        </div>
      )}

      {valid && (
        <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
          <path d={wobblyLine(10, 55 - (r / t) * 50, 80)} stroke="#ab3232" strokeWidth="3" fill="none" />
          <path d={wobblyLine(110, 55 - (curved / t) * 50, 80)} stroke="#dfaa44" strokeWidth="3" fill="none" />
        </svg>
      )}
    </FormCalculatorShell>
  )
}