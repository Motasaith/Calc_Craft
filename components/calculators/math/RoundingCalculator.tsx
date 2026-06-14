'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function RoundingCalculator() {
  const [val, setVal] = useState('')
  const [places, setPlaces] = useState('2')
  const [mode, setMode] = useState<'round' | 'floor' | 'ceil'>('round')
  const [result, setResult] = useState('')

  const calculate = () => {
    const v = parseFloat(val)
    const p = parseInt(places)
    if (isNaN(v)) { setResult('Invalid number'); return }
    if (isNaN(p)) { setResult('Invalid places'); return }
    const factor = Math.pow(10, p)
    let r = 0
    switch (mode) {
      case 'round': r = Math.round(v * factor) / factor; break
      case 'floor': r = Math.floor(v * factor) / factor; break
      case 'ceil': r = Math.ceil(v * factor) / factor; break
    }
    setResult(r.toFixed(Math.max(0, p)))
  }

  return (
    <FormCalculatorShell title="Rounding Calculator" badge="MATH">
      <RetroInput label="Number" value={val} onChange={setVal} placeholder="3.14159" id="rnd-val" />
      <RetroInput label="Decimal Places" value={places} onChange={setPlaces} placeholder="2" id="rnd-pl" />
      <RetroSelect label="Mode" value={mode} onChange={(v) => setMode(v as any)} options={[{value:'round',label:'Round'},{value:'floor',label:'Floor'},{value:'ceil',label:'Ceil'}]} id="rnd-mode" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Round</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
