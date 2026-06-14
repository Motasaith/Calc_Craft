'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function FlooringCalculator() {
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('4')
  const [plankLength, setPlankLength] = useState('1.2')
  const [plankWidth, setPlankWidth] = useState('0.19')
  const [waste, setWaste] = useState('10')
  const [result, setResult] = useState<{area:number,planks:number,boxes:number}|null>(null)

  const calculate = () => {
    const l = parseFloat(length), w = parseFloat(width)
    const pl = parseFloat(plankLength), pw = parseFloat(plankWidth), ws = parseFloat(waste)
    if (isNaN(l)||isNaN(w)||isNaN(pl)||isNaN(pw) || pl<=0||pw<=0) { setResult(null); return }
    const area = l * w
    const plankArea = pl * pw
    const planks = Math.ceil((area / plankArea) * (1 + ws / 100))
    setResult({ area, planks, boxes: Math.ceil(planks / 10) })
  }

  return (
    <FormCalculatorShell title="Flooring Calculator" badge="CONSTRUCTION">
      <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2">Room</div>
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Length (m)" value={length} onChange={setLength} placeholder="5" id="floor-l" /><RetroInput label="Width (m)" value={width} onChange={setWidth} placeholder="4" id="floor-w" /></div>
      <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2 mt-3">Plank Size</div>
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Length (m)" value={plankLength} onChange={setPlankLength} placeholder="1.2" id="floor-pl" /><RetroInput label="Width (m)" value={plankWidth} onChange={setPlankWidth} placeholder="0.19" id="floor-pw" /></div>
      <RetroInput label="Waste %" value={waste} onChange={setWaste} placeholder="10" id="floor-w" unit="%" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Area" value={`${result.area.toFixed(2)} m²`} />
          <ResultDisplay label="Planks" value={result.planks} large />
          <ResultDisplay label="Boxes" value={result.boxes} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
