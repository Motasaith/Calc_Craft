'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function DewPointCalculator() {
  const [unit, setUnit] = useState<'c' | 'f'>('c')
  const [temp, setTemp] = useState('20')
  const [humidity, setHumidity] = useState('60')
  const [result, setResult] = useState('')

  const calculate = () => {
    const t = parseFloat(temp), h = parseFloat(humidity)
    if (isNaN(t)||isNaN(h) || h<=0 || h>100) { setResult('Invalid'); return }
    let T = t
    if (unit === 'f') T = (t - 32) * 5 / 9
    const alpha = Math.log(h / 100) + (17.27 * T) / (237.3 + T)
    const dp = (237.3 * alpha) / (17.27 - alpha)
    if (unit === 'f') setResult(`${((dp * 9 / 5) + 32).toFixed(1)} °F`)
    else setResult(`${dp.toFixed(1)} °C`)
  }

  return (
    <FormCalculatorShell title="Dew Point" badge="MISC">
      <RetroSelect label="Unit" value={unit} onChange={(v) => { setUnit(v as any); setResult('') }} options={[{value:'c',label:'Celsius'},{value:'f',label:'Fahrenheit'}]} id="dp-unit" />
      <RetroInput label={`Temperature (°${unit.toUpperCase()})`} value={temp} onChange={setTemp} placeholder="20" id="dp-t" />
      <RetroInput label="Humidity (%)" value={humidity} onChange={setHumidity} placeholder="60" id="dp-h" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Dew Point" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
