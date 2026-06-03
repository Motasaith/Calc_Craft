'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

const units: Record<string, number> = { tsp: 1, tbsp: 3, 'fl oz': 6, cup: 48, pint: 96, quart: 192, gallon: 768, ml: 0.202884, L: 202.884 }

export default function CookingConverter() {
  const [value, setValue] = useState('1'); const [from, setFrom] = useState('cup'); const [to, setTo] = useState('ml')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? (v * units[from]) / units[to] : 0
  const options = Object.keys(units).map((u) => ({ value: u, label: u }))

  return (
    <FormCalculatorShell title="Cooking Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="cook-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="cook-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="cook-to" />
      </div>
      {valid && <div className="mt-4"><ResultDisplay label={`${value} ${from} =`} value={`${parseFloat(result.toPrecision(6))} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
