'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { convertUnits } from '@/lib/calc-engine'

const units = ['mg', 'g', 'kg', 'ton', 'oz', 'lb', 'st']
const unitLabels: Record<string, string> = {
  mg: 'mg (Milligram)', g: 'g (Gram)', kg: 'kg (Kilogram)',
  ton: 't (Metric Ton)', oz: 'oz (Ounce)', lb: 'lb (Pound)', st: 'st (Stone)',
}

export default function WeightConverter() {
  const [value, setValue] = useState('1'); const [from, setFrom] = useState('kg'); const [to, setTo] = useState('lb')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? convertUnits(v, from, to, 'weight') : 0
  const options = units.map((u) => ({ value: u, label: unitLabels[u] || u }))

  return (
    <FormCalculatorShell title="Weight Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="wt-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="wt-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="wt-to" />
      </div>
      {valid && <div className="mt-4"><ResultDisplay label={`${value} ${from} =`} value={`${result} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
