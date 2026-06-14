'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

const UNITS: Record<string, number> = { Pa: 1, kPa: 1000, MPa: 1e6, bar: 1e5, mbar: 100, psi: 6894.76, atm: 101325, torr: 133.322 }

export default function PressureConverter() {
  const [val, setVal] = useState('1')
  const [from, setFrom] = useState('bar')
  const [to, setTo] = useState('psi')
  const [result, setResult] = useState('')

  const calculate = () => {
    const v = parseFloat(val)
    if (isNaN(v)) { setResult('Invalid'); return }
    const fromFactor = UNITS[from] || 1
    const toFactor = UNITS[to] || 1
    const res = v * fromFactor / toFactor
    setResult(res.toLocaleString('en-US', { maximumFractionDigits: 6 }))
  }

  const opts = Object.keys(UNITS).map(u => ({ value: u, label: u }))

  return (
    <FormCalculatorShell title="Pressure Converter" badge="CONVERSION">
      <RetroInput label="Value" value={val} onChange={setVal} placeholder="1" id="pres-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={opts} id="pres-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={opts} id="pres-to" />
      </div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={`${result} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
