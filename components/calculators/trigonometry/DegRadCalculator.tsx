'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function DegRadCalculator() {
  const [mode, setMode] = useState<'deg-to-rad' | 'rad-to-deg' | 'deg-to-grad'>('deg-to-rad')
  const [value, setValue] = useState('180')
  const [result, setResult] = useState('')

  const calculate = () => {
    const v = parseFloat(value)
    if (isNaN(v)) { setResult('Invalid'); return }
    switch (mode) {
      case 'deg-to-rad': setResult(`${(v * Math.PI / 180).toFixed(6)} rad`); break
      case 'rad-to-deg': setResult(`${(v * 180 / Math.PI).toFixed(4)}°`); break
      case 'deg-to-grad': setResult(`${(v * 10 / 9).toFixed(4)} gon`); break
    }
  }

  return (
    <FormCalculatorShell title="Degrees ↔ Radians" badge="TRIGONOMETRY">
      <RetroSelect label="Convert" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'deg-to-rad',label:'Degrees → Radians'},{value:'rad-to-deg',label:'Radians → Degrees'},{value:'deg-to-grad',label:'Degrees → Gradians'}]} id="dr-mode" />
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="180" id="dr-v" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
