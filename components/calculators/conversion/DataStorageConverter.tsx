'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

const units: Record<string, number> = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, PB: 1125899906842624 }

export default function DataStorageConverter() {
  const [value, setValue] = useState('1'); const [from, setFrom] = useState('GB'); const [to, setTo] = useState('MB')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? (v * units[from]) / units[to] : 0
  const options = Object.keys(units).map((u) => ({ value: u, label: u }))

  return (
    <FormCalculatorShell title="Data Storage Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="data-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="data-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="data-to" />
      </div>
      {valid && <div className="mt-4"><ResultDisplay label={`${value} ${from} =`} value={`${parseFloat(result.toPrecision(10))} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
