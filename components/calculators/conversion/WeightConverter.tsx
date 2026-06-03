'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

const units: Record<string, number> = {
  mg: 0.001, g: 1, kg: 1000, oz: 28.3495, lb: 453.592, st: 6350.29, ton_us: 907185, ton_metric: 1000000, ct: 0.2,
}

export default function WeightConverter() {
  const [value, setValue] = useState('1'); const [from, setFrom] = useState('kg'); const [to, setTo] = useState('lb')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? (v * units[from]) / units[to] : 0
  const options = Object.keys(units).map((u) => ({ value: u, label: u.replace('_', ' ') }))

  return (
    <FormCalculatorShell title="Weight Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="wt-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="wt-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="wt-to" />
      </div>
      {valid && <div className="mt-4"><ResultDisplay label={`${value} ${from} =`} value={`${parseFloat(result.toPrecision(10))} ${to.replace('_', ' ')}`} large /></div>}
    </FormCalculatorShell>
  )
}
