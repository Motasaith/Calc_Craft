'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function Distance2dCalculator() {
  const [x1, setX1] = useState('0')
  const [y1, setY1] = useState('0')
  const [x2, setX2] = useState('3')
  const [y2, setY2] = useState('4')
  const [result, setResult] = useState<{distance:number,midpoint:string,slope:number}|null>(null)

  const calculate = () => {
    const xv1 = parseFloat(x1), yv1 = parseFloat(y1), xv2 = parseFloat(x2), yv2 = parseFloat(y2)
    if (isNaN(xv1)||isNaN(yv1)||isNaN(xv2)||isNaN(yv2)) { setResult(null); return }
    const dx = xv2 - xv1, dy = yv2 - yv1
    const distance = Math.sqrt(dx*dx + dy*dy)
    const midpoint = `(${(xv1+xv2)/2}, ${(yv1+yv2)/2})`
    const slope = dx === 0 ? Infinity : dy / dx
    setResult({ distance, midpoint, slope })
  }

  return (
    <FormCalculatorShell title="2D Distance" badge="GEOMETRY">
      <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2">Point 1</div>
      <div className="grid grid-cols-2 gap-3"><RetroInput label="X₁" value={x1} onChange={setX1} placeholder="0" id="d2-x1" /><RetroInput label="Y₁" value={y1} onChange={setY1} placeholder="0" id="d2-y1" /></div>
      <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2 mt-3">Point 2</div>
      <div className="grid grid-cols-2 gap-3"><RetroInput label="X₂" value={x2} onChange={setX2} placeholder="3" id="d2-x2" /><RetroInput label="Y₂" value={y2} onChange={setY2} placeholder="4" id="d2-y2" /></div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Distance" value={result.distance.toFixed(3)} />
          <ResultDisplay label="Midpoint" value={result.midpoint} />
          <ResultDisplay label="Slope" value={result.slope === Infinity ? '∞' : result.slope.toFixed(3)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
