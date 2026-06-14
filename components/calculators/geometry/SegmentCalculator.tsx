'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function SegmentCalculator() {
  const [unit, setUnit] = useState<'deg' | 'rad'>('deg')
  const [radius, setRadius] = useState('5')
  const [angle, setAngle] = useState('60')
  const [result, setResult] = useState<{area:number,arc:number}|null>(null)

  const calculate = () => {
    const r = parseFloat(radius), a = parseFloat(angle)
    if (isNaN(r)||isNaN(a) || r<=0) { setResult(null); return }
    const theta = unit === 'deg' ? a * Math.PI / 180 : a
    const sector = 0.5 * r * r * theta
    const triangle = 0.5 * r * r * Math.sin(theta)
    const area = sector - triangle
    const arc = r * theta
    setResult({ area, arc })
  }

  return (
    <FormCalculatorShell title="Circle Segment" badge="GEOMETRY">
      <RetroSelect label="Angle Unit" value={unit} onChange={(v) => { setUnit(v as any); setResult(null) }} options={[{value:'deg',label:'Degrees'},{value:'rad',label:'Radians'}]} id="seg-unit" />
      <RetroInput label="Radius" value={radius} onChange={setRadius} placeholder="5" id="seg-r" />
      <RetroInput label={`Angle (${unit})`} value={angle} onChange={setAngle} placeholder="60" id="seg-a" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Segment Area" value={result.area.toFixed(2)} />
          <ResultDisplay label="Arc Length" value={result.arc.toFixed(2)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
