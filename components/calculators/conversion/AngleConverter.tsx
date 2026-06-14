'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

const UNITS: Record<string, number> = { degrees: 1, radians: 57.2958, gradians: 0.9, turns: 360, arcmin: 1/60, arcsec: 1/3600 }

export default function AngleConverter() {
  const [val, setVal] = useState('90')
  const [from, setFrom] = useState('degrees')
  const [to, setTo] = useState('radians')
  const [result, setResult] = useState('')

  const calculate = () => {
    const v = parseFloat(val)
    if (isNaN(v)) { setResult('Invalid'); return }
    const deg = v * (UNITS[from] || 1)
    const res = deg / (UNITS[to] || 1)
    setResult(res.toLocaleString('en-US', { maximumFractionDigits: 6 }))
  }

  const opts = Object.keys(UNITS).map(u => ({ value: u, label: u.charAt(0).toUpperCase() + u.slice(1) }))

  return (
    <FormCalculatorShell title="Angle Converter" badge="CONVERSION">
      <RetroInput label="Value" value={val} onChange={setVal} placeholder="90" id="ang-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={opts} id="ang-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={opts} id="ang-to" />
      </div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={`${result} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
