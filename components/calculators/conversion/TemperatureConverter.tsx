'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TemperatureConverter() {
  const [value, setValue] = useState('100'); const [from, setFrom] = useState('C')
  const v = parseFloat(value)
  const valid = !isNaN(v)

  const toC = (val: number, unit: string) => {
    if (unit === 'C') return val; if (unit === 'F') return (val - 32) * 5 / 9; return val - 273.15
  }
  const fromC = (c: number, unit: string) => {
    if (unit === 'C') return c; if (unit === 'F') return c * 9 / 5 + 32; return c + 273.15
  }

  const celsius = valid ? toC(v, from) : 0
  const units = ['C', 'F', 'K'].filter((u) => u !== from)

  return (
    <FormCalculatorShell title="Temperature Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="100" id="temp-val" />
      <RetroSelect label="From" value={from} onChange={setFrom} id="temp-from"
        options={[{ value: 'C', label: 'Celsius (°C)' }, { value: 'F', label: 'Fahrenheit (°F)' }, { value: 'K', label: 'Kelvin (K)' }]} />
      {valid && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {units.map((u) => (
            <ResultDisplay key={u} label={u === 'C' ? 'Celsius' : u === 'F' ? 'Fahrenheit' : 'Kelvin'}
              value={`${parseFloat(fromC(celsius, u).toFixed(4))} ${u === 'C' ? '°C' : u === 'F' ? '°F' : 'K'}`} large />
          ))}
        </div>
      )}
    </FormCalculatorShell>
  )
}
