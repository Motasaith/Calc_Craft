'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function PolarRectangularCalculator() {
  const [mode, setMode] = useState<'polar-to-rect' | 'rect-to-polar'>('polar-to-rect')
  const [r, setR] = useState('5')
  const [theta, setTheta] = useState('30')
  const [x, setX] = useState('4')
  const [y, setY] = useState('3')
  const [result, setResult] = useState('')

  const calculate = () => {
    if (mode === 'polar-to-rect') {
      const rv = parseFloat(r), tv = parseFloat(theta)
      if (isNaN(rv)||isNaN(tv)) { setResult('Invalid'); return }
      const rad = tv * Math.PI / 180
      setResult(`x = ${(rv*Math.cos(rad)).toFixed(4)}, y = ${(rv*Math.sin(rad)).toFixed(4)}`)
    } else {
      const xv = parseFloat(x), yv = parseFloat(y)
      if (isNaN(xv)||isNaN(yv)) { setResult('Invalid'); return }
      const rv = Math.sqrt(xv*xv + yv*yv)
      const tv = Math.atan2(yv, xv) * 180 / Math.PI
      setResult(`r = ${rv.toFixed(4)}, θ = ${tv.toFixed(2)}°`)
    }
  }

  return (
    <FormCalculatorShell title="Polar ↔ Rectangular" badge="TRIGONOMETRY">
      <RetroSelect label="Direction" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'polar-to-rect',label:'Polar → Rectangular'},{value:'rect-to-polar',label:'Rectangular → Polar'}]} id="pr-mode" />
      {mode === 'polar-to-rect' && <><RetroInput label="r" value={r} onChange={setR} placeholder="5" id="pr-r" /><RetroInput label="θ (°)" value={theta} onChange={setTheta} placeholder="30" id="pr-t" /></>}
      {mode === 'rect-to-polar' && <><RetroInput label="x" value={x} onChange={setX} placeholder="4" id="pr-x" /><RetroInput label="y" value={y} onChange={setY} placeholder="3" id="pr-y" /></>}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
