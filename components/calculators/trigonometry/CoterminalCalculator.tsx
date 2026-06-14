'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function CoterminalCalculator() {
  const [angle, setAngle] = useState('45')
  const [result, setResult] = useState<{positive:string,negative:string}|null>(null)

  const calculate = () => {
    const a = parseFloat(angle)
    if (isNaN(a)) { setResult(null); return }
    const pos = a + 360, neg = a - 360
    setResult({ positive: `${pos}°`, negative: `${neg}°` })
  }

  return (
    <FormCalculatorShell title="Coterminal Angles" badge="TRIGONOMETRY">
      <RetroInput label="Angle (°)" value={angle} onChange={setAngle} placeholder="45" id="cot-a" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Find</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Positive" value={result.positive} />
          <ResultDisplay label="Negative" value={result.negative} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
