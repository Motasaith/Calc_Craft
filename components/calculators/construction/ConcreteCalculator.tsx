'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function ConcreteCalculator() {
  const [shape, setShape] = useState<'slab' | 'cylinder' | 'footing'>('slab')
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('8')
  const [depth, setDepth] = useState('0.15')
  const [diameter, setDiameter] = useState('0.3')
  const [height, setHeight] = useState('2')
  const [bagSize, setBagSize] = useState('25')
  const [result, setResult] = useState<{volume:number,bags:number}|null>(null)

  const calculate = () => {
    let volume = 0
    if (shape === 'slab' || shape === 'footing') {
      const l = parseFloat(length), w = parseFloat(width), d = parseFloat(depth)
      if (isNaN(l)||isNaN(w)||isNaN(d)) { setResult(null); return }
      volume = l * w * d
    } else {
      const d = parseFloat(diameter), h = parseFloat(height)
      if (isNaN(d)||isNaN(h)) { setResult(null); return }
      volume = Math.PI * Math.pow(d/2, 2) * h
    }
    const bs = parseFloat(bagSize)
    const bags = Math.ceil((volume * 2400 / 1000) / (bs / 1000))
    setResult({ volume, bags })
  }

  return (
    <FormCalculatorShell title="Concrete Calculator" badge="CONSTRUCTION">
      <RetroSelect label="Shape" value={shape} onChange={(v) => { setShape(v as any); setResult(null) }} options={[{value:'slab',label:'Slab'},{value:'cylinder',label:'Column'},{value:'footing',label:'Footing'}]} id="conc-shape" />
      {(shape === 'slab' || shape === 'footing') && (
        <>
          <div className="grid grid-cols-2 gap-3"><RetroInput label="Length (m)" value={length} onChange={setLength} placeholder="10" id="conc-l" /><RetroInput label="Width (m)" value={width} onChange={setWidth} placeholder="8" id="conc-w" /></div>
          <RetroInput label="Depth (m)" value={depth} onChange={setDepth} placeholder="0.15" id="conc-d" />
        </>
      )}
      {shape === 'cylinder' && (
        <>
          <RetroInput label="Diameter (m)" value={diameter} onChange={setDiameter} placeholder="0.3" id="conc-dia" />
          <RetroInput label="Height (m)" value={height} onChange={setHeight} placeholder="2" id="conc-h" />
        </>
      )}
      <RetroInput label="Bag Size (kg)" value={bagSize} onChange={setBagSize} placeholder="25" id="conc-bag" />
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
