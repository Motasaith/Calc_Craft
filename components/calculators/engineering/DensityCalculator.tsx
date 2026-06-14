'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function DensityCalculator() {
  const [solveFor, setSolveFor] = useState<'density' | 'mass' | 'volume'>('density')
  const [mass, setMass] = useState('1000')
  const [volume, setVolume] = useState('1')
  const [density, setDensity] = useState('1000')
  const [result, setResult] = useState('')

  const calculate = () => {
    const m = parseFloat(mass), v = parseFloat(volume), d = parseFloat(density)
    switch (solveFor) {
      case 'density': if (!isNaN(m)&&!isNaN(v) && v!==0) setResult(`${(m/v).toFixed(2)} kg/m³`); else setResult('Invalid'); break
      case 'mass': if (!isNaN(d)&&!isNaN(v)) setResult(`${(d*v).toFixed(2)} kg`); else setResult('Invalid'); break
      case 'volume': if (!isNaN(m)&&!isNaN(d) && d!==0) setResult(`${(m/d).toFixed(4)} m³`); else setResult('Invalid'); break
    }
  }

  return (
    <FormCalculatorShell title="Density Calculator" badge="ENGINEERING">
      <RetroSelect label="Solve For" value={solveFor} onChange={(v) => { setSolveFor(v as any); setResult('') }} options={[{value:'density',label:'Density (ρ)'},{value:'mass',label:'Mass (m)'},{value:'volume',label:'Volume (V)'}]} id="den-mode" />
      {solveFor !== 'mass' && <RetroInput label="Mass (kg)" value={mass} onChange={setMass} placeholder="1000" id="den-m" />}
      {solveFor !== 'density' && <RetroInput label="Volume (m³)" value={volume} onChange={setVolume} placeholder="1" id="den-v" />}
      {solveFor !== 'volume' && <RetroInput label="Density (kg/m³)" value={density} onChange={setDensity} placeholder="1000" id="den-d" />}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label={solveFor.charAt(0).toUpperCase()+solveFor.slice(1)} value={result} large /></div>}
    </FormCalculatorShell>
  )
}
