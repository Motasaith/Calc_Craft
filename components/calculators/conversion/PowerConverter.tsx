'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

const UNITS: Record<string, number> = { W: 1, kW: 1000, MW: 1e6, hp: 745.7, 'hp-metric': 735.5, 'BTU/hr': 0.293071 }

export default function PowerConverter() {
  const [val, setVal] = useState('1')
  const [from, setFrom] = useState('kW')
  const [to, setTo] = useState('hp')
  const [result, setResult] = useState('')

  const calculate = () => {
    const v = parseFloat(val)
    if (isNaN(v)) { setResult('Invalid'); return }
    const watts = v * (UNITS[from] || 1)
    const res = watts / (UNITS[to] || 1)
    setResult(res.toLocaleString('en-US', { maximumFractionDigits: 4 }))
  }

  const opts = Object.keys(UNITS).map(u => ({ value: u, label: u }))

  return (
    <FormCalculatorShell title="Power Converter" badge="CONVERSION">
      <RetroInput label="Value" value={val} onChange={setVal} placeholder="1" id="pow-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={opts} id="pow-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={opts} id="pow-to" />
      </div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={`${result} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
