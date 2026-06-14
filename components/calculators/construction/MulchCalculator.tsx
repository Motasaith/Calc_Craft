'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function MulchCalculator() {
  const [shape, setShape] = useState<'rectangle' | 'circle'>('rectangle')
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('3')
  const [diameter, setDiameter] = useState('4')
  const [depth, setDepth] = useState('0.05')
  const [bagSize, setBagSize] = useState('0.05')
  const [result, setResult] = useState<{volume:number,bags:number}|null>(null)

  const calculate = () => {
    const d = parseFloat(depth)
    if (isNaN(d)) { setResult(null); return }
    let area = 0
    if (shape === 'rectangle') {
      const l = parseFloat(length), w = parseFloat(width)
      if (isNaN(l)||isNaN(w)) { setResult(null); return }
      area = l * w
    } else {
      const dia = parseFloat(diameter)
      if (isNaN(dia)) { setResult(null); return }
      area = Math.PI * Math.pow(dia/2, 2)
    }
    const volume = area * d
    const bs = parseFloat(bagSize)
    const bags = Math.ceil(volume / (bs || 0.05))
    setResult({ volume, bags })
  }

  return (
    <FormCalculatorShell title="Mulch Calculator" badge="CONSTRUCTION">
      <RetroSelect label="Shape" value={shape} onChange={(v) => { setShape(v as any); setResult(null) }} options={[{value:'rectangle',label:'Rectangle'},{value:'circle',label:'Circle'}]} id="mulch-shape" />
      {shape === 'rectangle' ? <div className="grid grid-cols-2 gap-3"><RetroInput label="Length (m)" value={length} onChange={setLength} placeholder="5" id="mulch-l" /><RetroInput label="Width (m)" value={width} onChange={setWidth} placeholder="3" id="mulch-w" /></div> :
      <RetroInput label="Diameter (m)" value={diameter} onChange={setDiameter} placeholder="4" id="mulch-dia" />}
      <RetroInput label="Depth (m)" value={depth} onChange={setDepth} placeholder="0.05" id="mulch-d" />
      <RetroInput label="Bag Size (m³)" value={bagSize} onChange={setBagSize} placeholder="0.05" id="mulch-bag" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Volume" value={`${result.volume.toFixed(2)} m³`} />
          <ResultDisplay label="Bags Needed" value={result.bags} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
