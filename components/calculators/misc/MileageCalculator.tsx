'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function MileageCalculator() {
  const [mode, setMode] = useState<'mpg' | 'lp100' | 'kmpl'>('mpg')
  const [distance, setDistance] = useState('500')
  const [fuel, setFuel] = useState('40')
  const [result, setResult] = useState('')

  const calculate = () => {
    const d = parseFloat(distance), f = parseFloat(fuel)
    if (isNaN(d)||isNaN(f) || f<=0) { setResult('Invalid'); return }
    switch (mode) {
      case 'mpg': setResult(`${((d * 0.621371) / (f * 0.264172)).toFixed(2)} MPG (US)`); break
      case 'lp100': setResult(`${((f / d) * 100).toFixed(2)} L/100km`); break
      case 'kmpl': setResult(`${(d / f).toFixed(2)} km/L`); break
    }
  }

  return (
    <FormCalculatorShell title="Mileage Calculator" badge="MISC">
      <RetroSelect label="Mode" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'mpg',label:'MPG (US)'},{value:'lp100',label:'L/100km'},{value:'kmpl',label:'km/L'}]} id="mile-mode" />
      <RetroInput label="Distance (km)" value={distance} onChange={setDistance} placeholder="500" id="mile-d" />
      <RetroInput label="Fuel Used (L)" value={fuel} onChange={setFuel} placeholder="40" id="mile-f" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Efficiency" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
