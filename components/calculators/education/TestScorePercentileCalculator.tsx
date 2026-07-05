'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyLine(x: number, y: number, w: number) {
  return `M ${x} ${y} Q ${x + w / 2} ${y - 8} ${x + w} ${y}`
}

// Normal CDF approximation (Abramowitz & Stegun)
function normalCdf(x: number, mean: number, sd: number) {
  const z = (x - mean) / (sd * Math.SQRT2)
  const t = 1 / (1 + 0.3275911 * Math.abs(z))
  const erf =
    1 -
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z)
  const cdf = 0.5 * (1 + (z >= 0 ? erf : -erf))
  return cdf
}

export default function TestScorePercentileCalculator() {
  const [score, setScore] = useState('85')
  const [mean, setMean] = useState('70')
  const [sd, setSd] = useState('10')

  const sc = parseFloat(score)
  const m = parseFloat(mean)
  const s = parseFloat(sd)

  const valid = !isNaN(sc) && !isNaN(m) && !isNaN(s) && s > 0

  const percentile = valid ? normalCdf(sc, m, s) * 100 : 0
  const zScore = valid ? (sc - m) / s : 0

  return (
    <FormCalculatorShell
      title="Test Percentile"
      subtitle="Percentile rank from score distribution"
      badge="EDUCATION"
    >
      <div>
        <RetroInput label="Your Score" value={score} onChange={setScore} unit="pts" />
        <RetroInput label="Mean Score" value={mean} onChange={setMean} unit="pts" />
        <RetroInput label="Standard Deviation" value={sd} onChange={setSd} unit="pts" />
      </div>

      {valid && (
        <div className="space-y-2 mb-3">
          <ResultDisplay label="Percentile Rank" value={percentile.toFixed(1)} unit="%" large />
          <ResultDisplay label="Z-Score" value={zScore.toFixed(2)} />
        </div>
      )}

      {valid && (
        <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
          <path d={wobblyLine(10, 50, 180)} stroke="#7a9a7a" strokeWidth="2" fill="none" />
          <path d={wobblyLine(10, 50, Math.max(10, (percentile / 100) * 180))} stroke="#dfaa44" strokeWidth="3" fill="none" />
        </svg>
      )}
    </FormCalculatorShell>
  )
}