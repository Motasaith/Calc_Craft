'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function UnitCircleCalculator() {
  const [unit, setUnit] = useState<'deg' | 'rad'>('deg')
  const [angle, setAngle] = useState('30')
  const [result, setResult] = useState<{x:number,y:number,sin:number,cos:number}|null>(null)

  const calculate = () => {
    const a = parseFloat(angle)
    if (isNaN(a)) { setResult(null); return }
    const rad = unit === 'deg' ? a * Math.PI / 180 : a
    const sin = Math.sin(rad), cos = Math.cos(rad)
    setResult({ x: cos, y: sin, sin, cos })
  }

  return (
    <FormCalculatorShell title="Unit Circle" badge="TRIGONOMETRY">
      <RetroSelect label="Unit" value={unit} onChange={(v) => { setUnit(v as any); setResult(null) }} options={[{value:'deg',label:'Degrees'},{value:'rad',label:'Radians'}]} id="uc-unit" />
      <RetroInput label={`Angle (${unit})`} value={angle} onChange={setAngle} placeholder="30" id="uc-a" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="x = cos(θ)" value={result.x.toFixed(6)} />
          <ResultDisplay label="y = sin(θ)" value={result.y.toFixed(6)} />
          <ResultDisplay label="sin(θ)" value={result.sin.toFixed(6)} />
          <ResultDisplay label="cos(θ)" value={result.cos.toFixed(6)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
