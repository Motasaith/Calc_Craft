'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

const units: Record<string, number> = { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, Wh: 3600, kWh: 3600000, BTU: 1055.06, eV: 1.602e-19 }

export default function EnergyConverter() {
  const [value, setValue] = useState('1'); const [from, setFrom] = useState('kWh'); const [to, setTo] = useState('kcal')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? (v * units[from]) / units[to] : 0
  const options = Object.keys(units).map((u) => ({ value: u, label: u }))

  return (
    <FormCalculatorShell title="Energy Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="energy-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="energy-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="energy-to" />
      </div>
      {valid && <div className="mt-4"><ResultDisplay label={`${value} ${from} =`} value={`${parseFloat(result.toPrecision(8))} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
