'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function HeatIndexCalculator() {
  const [unit, setUnit] = useState<'c' | 'f'>('c')
  const [temp, setTemp] = useState('30')
  const [humidity, setHumidity] = useState('70')
  const [result, setResult] = useState('')

  const calculate = () => {
    const t = parseFloat(temp), h = parseFloat(humidity)
    if (isNaN(t)||isNaN(h) || h<=0 || h>100) { setResult('Invalid'); return }
    let T = t
    if (unit === 'c') T = (t * 9 / 5) + 32
    const HI = -42.379 + 2.04901523*T + 10.14333127*h - 0.22475541*T*h - 6.83783e-3*T*T - 5.481717e-2*h*h + 1.22874e-3*T*T*h + 8.5282e-4*T*h*h - 1.99e-6*T*T*h*h
    if (unit === 'c') setResult(`${((HI - 32) * 5 / 9).toFixed(1)} °C`)
    else setResult(`${HI.toFixed(1)} °F`)
  }

  return (
    <FormCalculatorShell title="Heat Index" badge="MISC">
      <RetroSelect label="Unit" value={unit} onChange={(v) => { setUnit(v as any); setResult('') }} options={[{value:'c',label:'Celsius'},{value:'f',label:'Fahrenheit'}]} id="hi-unit" />
      <RetroInput label={`Temperature (°${unit.toUpperCase()})`} value={temp} onChange={setTemp} placeholder="30" id="hi-t" />
      <RetroInput label="Humidity (%)" value={humidity} onChange={setHumidity} placeholder="70" id="hi-h" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Feels Like" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
