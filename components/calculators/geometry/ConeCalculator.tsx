'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function ConeCalculator() {
  const [radius, setRadius] = useState('3')
  const [height, setHeight] = useState('4')
  const [result, setResult] = useState<{volume:number,slant:number,lateral:number,total:number}|null>(null)

  const calculate = () => {
    const r = parseFloat(radius), h = parseFloat(height)
    if (isNaN(r)||isNaN(h) || r<=0 || h<=0) { setResult(null); return }
    const slant = Math.sqrt(r*r + h*h)
    const volume = (1/3) * Math.PI * r * r * h
    const lateral = Math.PI * r * slant
    const total = lateral + Math.PI * r * r
    setResult({ volume, slant, lateral, total })
  }

  return (
    <FormCalculatorShell title="Cone Calculator" badge="GEOMETRY">
      <RetroInput label="Radius" value={radius} onChange={setRadius} placeholder="3" id="cone-r" />
      <RetroInput label="Height" value={height} onChange={setHeight} placeholder="4" id="cone-h" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Volume" value={result.volume.toFixed(2)} />
          <ResultDisplay label="Slant Height" value={result.slant.toFixed(2)} />
          <ResultDisplay label="Lateral Area" value={result.lateral.toFixed(2)} />
          <ResultDisplay label="Total Area" value={result.total.toFixed(2)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
