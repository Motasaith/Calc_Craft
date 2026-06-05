'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { convertUnits } from '@/lib/calc-engine'

const units = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi', 'nmi', 'μm']
const unitLabels: Record<string, string> = {
  mm: 'mm (Millimeter)', cm: 'cm (Centimeter)', m: 'm (Meter)', km: 'km (Kilometer)',
  in: 'in (Inch)', ft: 'ft (Foot)', yd: 'yd (Yard)', mi: 'mi (Mile)',
  nmi: 'nmi (Nautical Mile)', 'μm': 'μm (Micrometer)',
}

export default function LengthConverter() {
  const [value, setValue] = useState('1'); const [from, setFrom] = useState('m'); const [to, setTo] = useState('ft')

  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? convertUnits(v, from, to, 'length') : 0

  const options = units.map((u) => ({ value: u, label: unitLabels[u] || u }))

  return (
    <FormCalculatorShell title="Length Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="len-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="len-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="len-to" />
      </div>
      {valid && <div className="mt-4"><ResultDisplay label={`${value} ${from} =`} value={`${result} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
