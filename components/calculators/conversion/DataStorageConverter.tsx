'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { convertUnits } from '@/lib/calc-engine'

const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
const unitLabels: Record<string, string> = {
  B: 'B (Byte)', KB: 'KB (Kilobyte)', MB: 'MB (Megabyte)',
  GB: 'GB (Gigabyte)', TB: 'TB (Terabyte)', PB: 'PB (Petabyte)',
}

export default function DataStorageConverter() {
  const [value, setValue] = useState('1'); const [from, setFrom] = useState('GB'); const [to, setTo] = useState('MB')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? convertUnits(v, from, to, 'data') : 0
  const options = units.map((u) => ({ value: u, label: unitLabels[u] || u }))

  return (
    <FormCalculatorShell title="Data Storage Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="data-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="data-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="data-to" />
      </div>
      {valid && <div className="mt-4"><ResultDisplay label={`${value} ${from} =`} value={`${result} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
