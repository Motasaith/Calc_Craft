'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function ParallelogramCalculator() {
  const [base, setBase] = useState('8')
  const [side, setSide] = useState('5')
  const [height, setHeight] = useState('4')
  const [angle, setAngle] = useState('60')
  const [result, setResult] = useState<{area:number,perimeter:number,diag1:number,diag2:number}|null>(null)

  const calculate = () => {
    const b = parseFloat(base), s = parseFloat(side), h = parseFloat(height), a = parseFloat(angle)
    if (isNaN(b)||isNaN(s)||isNaN(h)||isNaN(a) || b<=0 || s<=0) { setResult(null); return }
    const area = b * h
    const perimeter = 2 * (b + s)
    const rad = a * Math.PI / 180
    const diag1 = Math.sqrt(b*b + s*s + 2*b*s*Math.cos(rad))
    const diag2 = Math.sqrt(b*b + s*s - 2*b*s*Math.cos(rad))
    setResult({ area, perimeter, diag1, diag2 })
  }

  return (
    <FormCalculatorShell title="Parallelogram" badge="GEOMETRY">
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Base" value={base} onChange={setBase} placeholder="8" id="para-b" /><RetroInput label="Side" value={side} onChange={setSide} placeholder="5" id="para-s" /></div>
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Height" value={height} onChange={setHeight} placeholder="4" id="para-h" /><RetroInput label="Angle (°)" value={angle} onChange={setAngle} placeholder="60" id="para-a" /></div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Area" value={result.area.toFixed(2)} />
          <ResultDisplay label="Perimeter" value={result.perimeter.toFixed(2)} />
          <ResultDisplay label="Diagonal 1" value={result.diag1.toFixed(2)} />
          <ResultDisplay label="Diagonal 2" value={result.diag2.toFixed(2)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
