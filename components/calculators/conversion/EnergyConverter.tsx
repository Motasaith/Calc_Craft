'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { convertUnits } from '@/lib/calc-engine'

const units = ['J', 'kJ', 'cal', 'kcal', 'Wh', 'kWh', 'BTU', 'eV']
const unitLabels: Record<string, string> = {
  J: 'J (Joule)', kJ: 'kJ (Kilojoule)', cal: 'cal (Calorie)', kcal: 'kcal (Kilocalorie)',
  Wh: 'Wh (Watt-hour)', kWh: 'kWh (Kilowatt-hour)', BTU: 'BTU (British Thermal Unit)', eV: 'eV (Electron Volt)',
}

export default function EnergyConverter() {
  const [value, setValue] = useState('1'); const [from, setFrom] = useState('kWh'); const [to, setTo] = useState('kcal')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? convertUnits(v, from, to, 'energy') : 0
  const options = units.map((u) => ({ value: u, label: unitLabels[u] || u }))

  return (
    <FormCalculatorShell title="Energy Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="energy-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="energy-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="energy-to" />
      </div>
      {valid && <div className="mt-4"><ResultDisplay label={`${value} ${from} =`} value={`${result} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
