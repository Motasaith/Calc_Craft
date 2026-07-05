'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(x: number, y: number, w: number) {
  return `M ${x} ${y} Q ${x + w / 2} ${y - 6} ${x + w} ${y}`
}

export default function ExamScoreCalculator() {
  const [current, setCurrent] = useState('85')
  const [target, setTarget] = useState('90')
  const [weight, setWeight] = useState('40')

  const c = parseFloat(current)
  const tg = parseFloat(target)
  const w = parseFloat(weight)

  const valid = !isNaN(c) && !isNaN(tg) && !isNaN(w) && w > 0 && w <= 100

  // current*(1-w/100) + exam*(w/100) = target
  // exam = (target - current*(1-w/100)) / (w/100)
  const needed = valid ? (tg - c * (1 - w / 100)) / (w / 100) : 0
  const possible = valid ? needed <= 100 : false

  return (
    <FormCalculatorShell
      title="Exam Score Needed"
      subtitle="Find required final exam score"
      badge="EDUCATION"
    >
      <div>
        <RetroInput label="Current Grade" value={current} onChange={setCurrent} unit="%" />
        <RetroInput label="Target Grade" value={target} onChange={setTarget} unit="%" />
        <RetroInput label="Exam Weight" value={weight} onChange={setWeight} unit="%" />
      </div>

      {valid && (
        <div className="space-y-2 mb-3">
          <ResultDisplay
            label="Needed Exam Score"
            value={Math.max(0, needed).toFixed(1)}
            unit="%"
            large
          />
          <ResultDisplay
            label="Achievable?"
            value={possible ? 'Yes' : 'No'}
          />
        </div>
      )}

      {valid && (
        <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
          <path d={wobblyLine(10, 55 - (c / 100) * 50, 80)} stroke="#7a9a7a" strokeWidth="3" fill="none" />
          <path d={wobblyLine(110, 55 - (Math.min(100, Math.max(0, needed)) / 100) * 50, 80)} stroke="#dfaa44" strokeWidth="3" fill="none" />
        </svg>
      )}
    </FormCalculatorShell>
  )
}