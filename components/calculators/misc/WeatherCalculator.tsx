'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function WeatherCalculator() {
  const [mode, setMode] = useState<'barometer' | 'altitude' | 'pressure'>('barometer')
  const [pressure, setPressure] = useState('1013')
  const [altitude, setAltitude] = useState('0')
  const [temp, setTemp] = useState('15')
  const [result, setResult] = useState('')

  const calculate = () => {
    const p = parseFloat(pressure), a = parseFloat(altitude), t = parseFloat(temp)
    switch (mode) {
      case 'barometer':
        if (isNaN(p)||isNaN(a)||isNaN(t)) { setResult('Invalid'); return }
        const corrected = p * Math.pow(1 - (0.0065 * a) / (t + 0.0065 * a + 273.15), -5.257)
        setResult(`${corrected.toFixed(1)} hPa (sea level)`)
        break
      case 'altitude':
        if (isNaN(p)||isNaN(t)) { setResult('Invalid'); return }
        const alt = 44330 * (1 - Math.pow(p / 1013.25, 1 / 5.255))
        setResult(`${alt.toFixed(0)} m`)
        break
      case 'pressure':
        if (isNaN(a)||isNaN(t)) { setResult('Invalid'); return }
        const pr = 1013.25 * Math.pow(1 - (0.0065 * a) / (t + 273.15), 5.257)
        setResult(`${pr.toFixed(1)} hPa`)
        break
    }
  }

  return (
    <FormCalculatorShell title="Weather Calculator" badge="MISC">
      <RetroSelect label="Mode" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'barometer',label:'Barometer Correction'},{value:'altitude',label:'Pressure → Altitude'},{value:'pressure',label:'Altitude → Pressure'}]} id="wx-mode" />
      {mode !== 'pressure' && <RetroInput label="Pressure (hPa)" value={pressure} onChange={setPressure} placeholder="1013" id="wx-p" />}
      {mode !== 'altitude' && <RetroInput label="Altitude (m)" value={altitude} onChange={setAltitude} placeholder="0" id="wx-a" />}
      <RetroInput label="Temperature (°C)" value={temp} onChange={setTemp} placeholder="15" id="wx-t" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
