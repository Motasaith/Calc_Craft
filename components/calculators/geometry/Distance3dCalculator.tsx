'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function Distance3dCalculator() {
  const [x1, setX1] = useState('0')
  const [y1, setY1] = useState('0')
  const [z1, setZ1] = useState('0')
  const [x2, setX2] = useState('1')
  const [y2, setY2] = useState('2')
  const [z2, setZ2] = useState('2')
  const [result, setResult] = useState<{distance:number,midpoint:string}|null>(null)

  const calculate = () => {
    const xv1 = parseFloat(x1), yv1 = parseFloat(y1), zv1 = parseFloat(z1)
    const xv2 = parseFloat(x2), yv2 = parseFloat(y2), zv2 = parseFloat(z2)
    if ([xv1,yv1,zv1,xv2,yv2,zv2].some(isNaN)) { setResult(null); return }
    const dx = xv2 - xv1, dy = yv2 - yv1, dz = zv2 - zv1
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz)
    const midpoint = `(${(xv1+xv2)/2}, ${(yv1+yv2)/2}, ${(zv1+zv2)/2})`
    setResult({ distance, midpoint })
  }

  return (
    <FormCalculatorShell title="3D Distance" badge="GEOMETRY">
      <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2">Point 1</div>
      <div className="grid grid-cols-3 gap-3"><RetroInput label="X₁" value={x1} onChange={setX1} placeholder="0" id="d3-x1" /><RetroInput label="Y₁" value={y1} onChange={setY1} placeholder="0" id="d3-y1" /><RetroInput label="Z₁" value={z1} onChange={setZ1} placeholder="0" id="d3-z1" /></div>
      <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2 mt-3">Point 2</div>
      <div className="grid grid-cols-3 gap-3"><RetroInput label="X₂" value={x2} onChange={setX2} placeholder="1" id="d3-x2" /><RetroInput label="Y₂" value={y2} onChange={setY2} placeholder="2" id="d3-y2" /><RetroInput label="Z₂" value={z2} onChange={setZ2} placeholder="2" id="d3-z2" /></div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Distance" value={result.distance.toFixed(3)} />
          <ResultDisplay label="Midpoint" value={result.midpoint} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
