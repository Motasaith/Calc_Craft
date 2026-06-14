'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function GravelCalculator() {
  const [shape, setShape] = useState<'rectangle' | 'circle'>('rectangle')
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('5')
  const [diameter, setDiameter] = useState('5')
  const [depth, setDepth] = useState('0.1')
  const [density, setDensity] = useState('1600')
  const [result, setResult] = useState<{volume:number,weight:number,tons:number}|null>(null)

  const calculate = () => {
    const d = parseFloat(depth), den = parseFloat(density)
    if (isNaN(d)||isNaN(den)) { setResult(null); return }
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
    const weight = volume * den
    setResult({ volume, weight, tons: weight / 1000 })
  }

  return (
    <FormCalculatorShell title="Gravel Calculator" badge="CONSTRUCTION">
      <RetroSelect label="Shape" value={shape} onChange={(v) => { setShape(v as any); setResult(null) }} options={[{value:'rectangle',label:'Rectangle'},{value:'circle',label:'Circle'}]} id="grav-shape" />
      {shape === 'rectangle' ? <div className="grid grid-cols-2 gap-3"><RetroInput label="Length (m)" value={length} onChange={setLength} placeholder="10" id="grav-l" /><RetroInput label="Width (m)" value={width} onChange={setWidth} placeholder="5" id="grav-w" /></div> :
      <RetroInput label="Diameter (m)" value={diameter} onChange={setDiameter} placeholder="5" id="grav-dia" />}
      <RetroInput label="Depth (m)" value={depth} onChange={setDepth} placeholder="0.1" id="grav-d" />
      <RetroInput label="Density (kg/m³)" value={density} onChange={setDensity} placeholder="1600" id="grav-den" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Volume" value={`${result.volume.toFixed(2)} m³`} />
          <ResultDisplay label="Weight" value={`${result.weight.toFixed(0)} kg`} />
          <ResultDisplay label="Tons" value={`${result.tons.toFixed(2)} t`} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
