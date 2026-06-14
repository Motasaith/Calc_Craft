'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function TireSizeCalculator() {
  const [width, setWidth] = useState('225')
  const [aspect, setAspect] = useState('45')
  const [rim, setRim] = useState('17')
  const [result, setResult] = useState<{diameter:number,width:number,revolutions:number}|null>(null)

  const calculate = () => {
    const w = parseFloat(width), a = parseFloat(aspect), r = parseFloat(rim)
    if (isNaN(w)||isNaN(a)||isNaN(r)) { setResult(null); return }
    const sidewall = (w * a) / 100
    const diameter = (sidewall * 2) / 25.4 + r
    const circumference = diameter * Math.PI * 25.4
    const revolutions = 1000000 / circumference
    setResult({ diameter, width: w, revolutions })
  }

  return (
    <FormCalculatorShell title="Tire Size" badge="MISC">
      <div className="grid grid-cols-3 gap-3"><RetroInput label="Width (mm)" value={width} onChange={setWidth} placeholder="225" id="tire-w" /><RetroInput label="Aspect (%)" value={aspect} onChange={setAspect} placeholder="45" id="tire-a" /><RetroInput label="Rim (in)" value={rim} onChange={setRim} placeholder="17" id="tire-r" /></div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Diameter" value={`${result.diameter.toFixed(1)} in`} />
          <ResultDisplay label="Width" value={`${result.width} mm`} />
          <ResultDisplay label="Rev/km" value={Math.round(result.revolutions)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
