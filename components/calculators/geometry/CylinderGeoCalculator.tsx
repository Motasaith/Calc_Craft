'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function CylinderGeoCalculator() {
  const [radius, setRadius] = useState('3')
  const [height, setHeight] = useState('10')
  const [result, setResult] = useState<{volume:number,lateral:number,total:number}|null>(null)

  const calculate = () => {
    const r = parseFloat(radius), h = parseFloat(height)
    if (isNaN(r)||isNaN(h) || r<=0 || h<=0) { setResult(null); return }
    const volume = Math.PI * r * r * h
    const lateral = 2 * Math.PI * r * h
    const total = lateral + 2 * Math.PI * r * r
    setResult({ volume, lateral, total })
  }

  return (
    <FormCalculatorShell title="Cylinder Calculator" badge="GEOMETRY">
      <RetroInput label="Radius" value={radius} onChange={setRadius} placeholder="3" id="cyl-r" />
      <RetroInput label="Height" value={height} onChange={setHeight} placeholder="10" id="cyl-h" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Volume" value={result.volume.toFixed(2)} />
          <ResultDisplay label="Lateral Area" value={result.lateral.toFixed(2)} />
          <ResultDisplay label="Total Area" value={result.total.toFixed(2)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
