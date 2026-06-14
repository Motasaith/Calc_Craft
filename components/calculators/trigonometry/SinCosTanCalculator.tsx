'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function SinCosTanCalculator() {
  const [unit, setUnit] = useState<'deg' | 'rad'>('deg')
  const [angle, setAngle] = useState('45')
  const [result, setResult] = useState<{sin:number,cos:number,tan:string}|null>(null)

  const calculate = () => {
    const a = parseFloat(angle)
    if (isNaN(a)) { setResult(null); return }
    const rad = unit === 'deg' ? a * Math.PI / 180 : a
    const sin = Math.sin(rad), cos = Math.cos(rad)
    const tan = Math.abs(cos) < 1e-10 ? 'undefined' : Math.tan(rad).toFixed(6)
    setResult({ sin, cos, tan })
  }

  return (
    <FormCalculatorShell title="Sin Cos Tan" badge="TRIGONOMETRY">
      <RetroSelect label="Unit" value={unit} onChange={(v) => { setUnit(v as any); setResult(null) }} options={[{value:'deg',label:'Degrees'},{value:'rad',label:'Radians'}]} id="sct-unit" />
      <RetroInput label={`Angle (${unit})`} value={angle} onChange={setAngle} placeholder="45" id="sct-a" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="sin" value={result.sin.toFixed(6)} />
          <ResultDisplay label="cos" value={result.cos.toFixed(6)} />
          <ResultDisplay label="tan" value={result.tan} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
