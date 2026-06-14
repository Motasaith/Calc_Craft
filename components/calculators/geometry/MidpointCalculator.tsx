'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function MidpointCalculator() {
  const [dim, setDim] = useState<'2d' | '3d'>('2d')
  const [x1, setX1] = useState('0')
  const [y1, setY1] = useState('0')
  const [z1, setZ1] = useState('0')
  const [x2, setX2] = useState('4')
  const [y2, setY2] = useState('6')
  const [z2, setZ2] = useState('8')
  const [result, setResult] = useState('')

  const calculate = () => {
    const xv1 = parseFloat(x1), yv1 = parseFloat(y1), zv1 = parseFloat(z1)
    const xv2 = parseFloat(x2), yv2 = parseFloat(y2), zv2 = parseFloat(z2)
    if ([xv1,yv1,xv2,yv2].some(isNaN)) { setResult(''); return }
    if (dim === '2d') {
      setResult(`(${(xv1+xv2)/2}, ${(yv1+yv2)/2})`)
    } else {
      if ([zv1,zv2].some(isNaN)) { setResult(''); return }
      setResult(`(${(xv1+xv2)/2}, ${(yv1+yv2)/2}, ${(zv1+zv2)/2})`)
    }
  }

  return (
    <FormCalculatorShell title="Midpoint Calculator" badge="GEOMETRY">
      <RetroSelect label="Dimensions" value={dim} onChange={(v) => { setDim(v as any); setResult('') }} options={[{value:'2d',label:'2D'},{value:'3d',label:'3D'}]} id="mid-dim" />
      <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2">Point 1</div>
      <div className="grid grid-cols-3 gap-3"><RetroInput label="X₁" value={x1} onChange={setX1} placeholder="0" id="mid-x1" /><RetroInput label="Y₁" value={y1} onChange={setY1} placeholder="0" id="mid-y1" /><RetroInput label="Z₁" value={z1} onChange={setZ1} placeholder="0" id="mid-z1" /></div>
      <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2 mt-3">Point 2</div>
      <div className="grid grid-cols-3 gap-3"><RetroInput label="X₂" value={x2} onChange={setX2} placeholder="4" id="mid-x2" /><RetroInput label="Y₂" value={y2} onChange={setY2} placeholder="6" id="mid-y2" /><RetroInput label="Z₂" value={z2} onChange={setZ2} placeholder="8" id="mid-z2" /></div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Midpoint" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
