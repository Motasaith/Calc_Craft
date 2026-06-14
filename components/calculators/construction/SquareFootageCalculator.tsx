'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function SquareFootageCalculator() {
  const [shape, setShape] = useState<'rectangle' | 'circle' | 'triangle' | 'trapezoid'>('rectangle')
  const [a, setA] = useState('10')
  const [b, setB] = useState('8')
  const [c, setC] = useState('6')
  const [d, setD] = useState('4')
  const [result, setResult] = useState('')

  const calculate = () => {
    const av = parseFloat(a), bv = parseFloat(b), cv = parseFloat(c), dv = parseFloat(d)
    let sqft = 0
    switch (shape) {
      case 'rectangle': if (!isNaN(av)&&!isNaN(bv)) sqft = av * bv; break
      case 'circle': if (!isNaN(av)) sqft = Math.PI * av * av; break
      case 'triangle': if (!isNaN(av)&&!isNaN(bv)) sqft = 0.5 * av * bv; break
      case 'trapezoid': if (!isNaN(av)&&!isNaN(bv)&&!isNaN(cv)) sqft = 0.5 * (av + bv) * cv; break
    }
    const sqm = sqft * 0.092903
    setResult(`${sqft.toFixed(2)} ft² = ${sqm.toFixed(2)} m²`)
  }

  return (
    <FormCalculatorShell title="Square Footage" badge="CONSTRUCTION">
      <RetroSelect label="Shape" value={shape} onChange={(v) => { setShape(v as any); setResult('') }} options={[{value:'rectangle',label:'Rectangle'},{value:'circle',label:'Circle'},{value:'triangle',label:'Triangle'},{value:'trapezoid',label:'Trapezoid'}]} id="sqft-shape" />
      {shape === 'rectangle' && <div className="grid grid-cols-2 gap-3"><RetroInput label="Length (ft)" value={a} onChange={setA} placeholder="10" id="sqft-l" /><RetroInput label="Width (ft)" value={b} onChange={setB} placeholder="8" id="sqft-w" /></div>}
      {shape === 'circle' && <RetroInput label="Radius (ft)" value={a} onChange={setA} placeholder="10" id="sqft-r" />}
      {shape === 'triangle' && <div className="grid grid-cols-2 gap-3"><RetroInput label="Base (ft)" value={a} onChange={setA} placeholder="10" id="sqft-b" /><RetroInput label="Height (ft)" value={b} onChange={setB} placeholder="8" id="sqft-h" /></div>}
      {shape === 'trapezoid' && <><div className="grid grid-cols-2 gap-3"><RetroInput label="Base A (ft)" value={a} onChange={setA} placeholder="10" id="sqft-ba" /><RetroInput label="Base B (ft)" value={b} onChange={setB} placeholder="8" id="sqft-bb" /></div><RetroInput label="Height (ft)" value={c} onChange={setC} placeholder="6" id="sqft-ht" /></>}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Area" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
