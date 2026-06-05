'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { convertTemperature } from '@/lib/calc-engine'

export default function TemperatureConverter() {
  const [value, setValue] = useState('100'); const [from, setFrom] = useState('C')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const units = ['C', 'F', 'K'].filter((u) => u !== from)
  const symbol = (u: string) => (u === 'C' ? '°C' : u === 'F' ? '°F' : 'K')
  const name = (u: string) => (u === 'C' ? 'Celsius' : u === 'F' ? 'Fahrenheit' : 'Kelvin')

  return (
    <FormCalculatorShell title="Temperature Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="100" id="temp-val" />
      <RetroSelect label="From" value={from} onChange={setFrom} id="temp-from"
        options={[{ value: 'C', label: 'Celsius (°C)' }, { value: 'F', label: 'Fahrenheit (°F)' }, { value: 'K', label: 'Kelvin (K)' }]} />
      {valid && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {units.map((u) => (
            <ResultDisplay key={u} label={name(u)}
              value={`${convertTemperature(v, from as 'C' | 'F' | 'K', u as 'C' | 'F' | 'K').toFixed(4)} ${symbol(u)}`} large />
          ))}
        </div>
      )}
    </FormCalculatorShell>
  )
}
