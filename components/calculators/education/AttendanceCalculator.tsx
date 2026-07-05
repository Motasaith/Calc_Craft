'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function AttendanceCalculator() {
  const [attended, setAttended] = useState('38')
  const [total, setTotal] = useState('45')
  const [target, setTarget] = useState('75')

  const a = parseFloat(attended)
  const t = parseFloat(total)
  const tg = parseFloat(target)

  const valid = !isNaN(a) && !isNaN(t) && !isNaN(tg) && t > 0 && a >= 0 && a <= t

  const currentPct = valid ? (a / t) * 100 : 0
  // classes needed to reach target: solve (a + n) / (t + n) >= tg/100
  // n >= (tg*t - 100*a) / (100 - tg)
  let needed = 0
  let canReach = true
  if (valid) {
    if (currentPct >= tg) {
      needed = 0
    } else {
      const denom = 100 - tg
      if (denom <= 0) {
        canReach = false
      } else {
        needed = Math.ceil((tg * t - 100 * a) / denom)
        if (needed < 0) needed = 0
      }
    }
  }

  return (
    <FormCalculatorShell
      title="Attendance"
      subtitle="Track attendance percentage"
      badge="EDUCATION"
    >
      <div>
        <RetroInput label="Classes Attended" value={attended} onChange={setAttended} unit="cls" />
        <RetroInput label="Total Classes" value={total} onChange={setTotal} unit="cls" />
        <RetroInput label="Target Attendance" value={target} onChange={setTarget} unit="%" />
      </div>

      {valid && (
        <div className="space-y-2 mb-3">
          <ResultDisplay label="Current Attendance" value={currentPct.toFixed(1)} unit="%" large />
          <ResultDisplay
            label="Classes Needed"
            value={canReach ? needed : 'N/A'}
            unit={canReach ? 'cls' : ''}
          />
        </div>
      )}

      {valid && (
        <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
          <path d={wobblyBar(20, 55 - (currentPct / 100) * 50, 70, (currentPct / 100) * 50)} fill="#dfaa44" stroke="#be8b32" strokeWidth="1" />
          <path d={wobblyBar(110, 55 - (tg / 100) * 50, 70, (tg / 100) * 50)} fill="#7a9a7a" stroke="#5a7a5a" strokeWidth="1" />
        </svg>
      )}
    </FormCalculatorShell>
  )
}