'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

const units: Record<string, number> = { 'km/h': 1, 'mph': 1.60934, 'm/s': 3.6, 'ft/s': 1.09728, 'knots': 1.852, 'mach': 1235.0 }

export default function SpeedConverter() {
  const [value, setValue] = useState('100'); const [from, setFrom] = useState('km/h'); const [to, setTo] = useState('mph')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? (v * units[from]) / units[to] : 0
  const options = Object.keys(units).map((u) => ({ value: u, label: u }))

  return (
    <FormCalculatorShell title="Speed Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="100" id="spd-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="spd-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="spd-to" />
      </div>
      {valid && <div className="mt-4"><ResultDisplay label={`${value} ${from} =`} value={`${parseFloat(result.toPrecision(8))} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
