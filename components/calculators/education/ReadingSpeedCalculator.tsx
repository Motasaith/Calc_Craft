'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ReadingSpeedCalculator() {
  const [words, setWords] = useState('2000')
  const [minutes, setMinutes] = useState('10')
  const [otherWords, setOtherWords] = useState('5000')

  const wd = parseFloat(words)
  const m = parseFloat(minutes)
  const ow = parseFloat(otherWords)

  const valid = !isNaN(wd) && !isNaN(m) && m > 0 && wd > 0

  const wpm = valid ? wd / m : 0
  const estTime = valid && !isNaN(ow) && ow > 0 ? ow / wpm : 0

  return (
    <FormCalculatorShell
      title="Reading Speed"
      subtitle="Words per minute & estimates"
      badge="EDUCATION"
    >
      <div>
        <RetroInput label="Words Read" value={words} onChange={setWords} unit="words" />
        <RetroInput label="Time Taken" value={minutes} onChange={setMinutes} unit="min" />
        <RetroInput label="Other Text Length" value={otherWords} onChange={setOtherWords} unit="words" />
      </div>

      {valid && (
        <div className="space-y-2 mb-3">
          <ResultDisplay label="Reading Speed" value={wpm.toFixed(0)} unit="WPM" large />
          <ResultDisplay label="Est. Time for Other" value={estTime.toFixed(1)} unit="min" />
        </div>
      )}

      {valid && (
        <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
          <path d={wobblyBar(20, 55 - Math.min(50, (wpm / 500) * 50), 70, Math.min(50, (wpm / 500) * 50))} fill="#dfaa44" stroke="#be8b32" strokeWidth="1" />
          <path d={wobblyBar(110, 55 - Math.min(50, (estTime / 60) * 50), 70, Math.min(50, (estTime / 60) * 50))} fill="#7a9a7a" stroke="#5a7a5a" strokeWidth="1" />
        </svg>
      )}
    </FormCalculatorShell>
  )
}