'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function ZScoreCalculator() {
  const [x, setX] = useState('')
  const [mean, setMean] = useState('')
  const [sd, setSd] = useState('')
  const [result, setResult] = useState('')

  const calculate = () => {
    const xv = parseFloat(x), mv = parseFloat(mean), sv = parseFloat(sd)
    if (isNaN(xv)||isNaN(mv)||isNaN(sv) || sv <= 0) { setResult('Invalid input'); return }
    const z = (xv - mv) / sv
    setResult(z.toFixed(4))
  }

  return (
    <FormCalculatorShell title="Z-Score Calculator" badge="MATH">
      <RetroInput label="Value (x)" value={x} onChange={setX} placeholder="85" id="zs-x" />
      <RetroInput label="Mean (μ)" value={mean} onChange={setMean} placeholder="75" id="zs-mu" />
      <RetroInput label="Std Dev (σ)" value={sd} onChange={setSd} placeholder="10" id="zs-sd" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Z-Score</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Z-Score" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
