'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

const UNITS: Record<string, number> = { 'MPG-US': 1, 'MPG-UK': 1.20095, 'L/100km': 235.215, 'km/L': 2.35215 }

export default function FuelConverter() {
  const [val, setVal] = useState('30')
  const [from, setFrom] = useState('MPG-US')
  const [to, setTo] = useState('L/100km')
  const [result, setResult] = useState('')

  const calculate = () => {
    const v = parseFloat(val)
    if (isNaN(v) || v <= 0) { setResult('Invalid'); return }
    const mpgUS = v * (UNITS[from] || 1)
    const res = mpgUS / (UNITS[to] || 1)
    setResult(res.toFixed(2))
  }

  const opts = Object.keys(UNITS).map(u => ({ value: u, label: u }))

  return (
    <FormCalculatorShell title="Fuel Converter" badge="CONVERSION">
      <RetroInput label="Value" value={val} onChange={setVal} placeholder="30" id="fuel-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={opts} id="fuel-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={opts} id="fuel-to" />
      </div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={`${result} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
