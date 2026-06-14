'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function RoofingCalculator() {
  const [shape, setShape] = useState<'gable' | 'hip' | 'flat'>('gable')
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('8')
  const [pitch, setPitch] = useState('30')
  const [overhang, setOverhang] = useState('0.5')
  const [waste, setWaste] = useState('10')
  const [result, setResult] = useState<{area:number,shingles:number}|null>(null)

  const calculate = () => {
    const l = parseFloat(length), w = parseFloat(width), p = parseFloat(pitch)
    const o = parseFloat(overhang), ws = parseFloat(waste)
    if (isNaN(l)||isNaN(w)||isNaN(p)) { setResult(null); return }
    const baseArea = (l + 2 * o) * (w + 2 * o)
    const slopeFactor = 1 / Math.cos(p * Math.PI / 180)
    const area = baseArea * slopeFactor * (shape === 'hip' ? 1.4 : shape === 'gable' ? 1.2 : 1)
    const shingles = Math.ceil((area / 3) * (1 + ws / 100))
    setResult({ area, shingles })
  }

  return (
    <FormCalculatorShell title="Roofing Calculator" badge="CONSTRUCTION">
      <RetroSelect label="Roof Type" value={shape} onChange={(v) => { setShape(v as any); setResult(null) }} options={[{value:'gable',label:'Gable'},{value:'hip',label:'Hip'},{value:'flat',label:'Flat'}]} id="roof-type" />
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Length (m)" value={length} onChange={setLength} placeholder="10" id="roof-l" /><RetroInput label="Width (m)" value={width} onChange={setWidth} placeholder="8" id="roof-w" /></div>
      <RetroInput label="Pitch (degrees)" value={pitch} onChange={setPitch} placeholder="30" id="roof-p" />
      <RetroInput label="Overhang (m)" value={overhang} onChange={setOverhang} placeholder="0.5" id="roof-o" />
      <RetroInput label="Waste %" value={waste} onChange={setWaste} placeholder="10" id="roof-w" unit="%" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Roof Area" value={`${result.area.toFixed(2)} m²`} />
          <ResultDisplay label="Shingle Bundles" value={result.shingles} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
