'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function WindChillCalculator() {
  const [unit, setUnit] = useState<'c' | 'f'>('c')
  const [temp, setTemp] = useState('5')
  const [wind, setWind] = useState('20')
  const [result, setResult] = useState('')

  const calculate = () => {
    const t = parseFloat(temp), w = parseFloat(wind)
    if (isNaN(t)||isNaN(w) || w < 3) { setResult('Wind must be ≥ 3 km/h'); return }
    let wc: number
    if (unit === 'c') {
      wc = 13.12 + 0.6215 * t - 11.37 * Math.pow(w, 0.16) + 0.3965 * t * Math.pow(w, 0.16)
      setResult(`${wc.toFixed(1)} °C`)
    } else {
      wc = 35.74 + 0.6215 * t - 35.75 * Math.pow(w, 0.16) + 0.4275 * t * Math.pow(w, 0.16)
      setResult(`${wc.toFixed(1)} °F`)
    }
  }

  return (
    <FormCalculatorShell title="Wind Chill" badge="MISC">
      <RetroSelect label="Unit" value={unit} onChange={(v) => { setUnit(v as any); setResult('') }} options={[{value:'c',label:'Celsius'},{value:'f',label:'Fahrenheit'}]} id="wc-unit" />
      <RetroInput label={`Temperature (°${unit.toUpperCase()})`} value={temp} onChange={setTemp} placeholder="5" id="wc-t" />
      <RetroInput label="Wind Speed (km/h)" value={wind} onChange={setWind} placeholder="20" id="wc-w" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Feels Like" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
