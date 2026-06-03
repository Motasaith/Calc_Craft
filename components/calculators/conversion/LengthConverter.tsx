'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

const units: Record<string, number> = {
  mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
  nmi: 1852, μm: 0.000001,
}

export default function LengthConverter() {
  const [value, setValue] = useState('1'); const [from, setFrom] = useState('m'); const [to, setTo] = useState('ft')

  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? (v * units[from]) / units[to] : 0

  const options = Object.keys(units).map((u) => ({ value: u, label: u }))

  return (
    <FormCalculatorShell title="Length Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="len-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="len-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="len-to" />
      </div>
      {valid && <div className="mt-4"><ResultDisplay label={`${value} ${from} =`} value={`${parseFloat(result.toPrecision(10))} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
