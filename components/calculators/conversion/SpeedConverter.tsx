'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { convertUnits } from '@/lib/calc-engine'

const units = ['m/s', 'km/h', 'mph', 'knots', 'ft/s', 'mach']
const unitLabels: Record<string, string> = {
  'm/s': 'm/s (Meters/second)', 'km/h': 'km/h (Kilometers/hour)', 'mph': 'mph (Miles/hour)',
  'knots': 'knots (Nautical miles/hour)', 'ft/s': 'ft/s (Feet/second)', 'mach': 'Mach (speed of sound)',
}

export default function SpeedConverter() {
  const [value, setValue] = useState('100'); const [from, setFrom] = useState('km/h'); const [to, setTo] = useState('mph')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? convertUnits(v, from, to, 'speed') : 0
  const options = units.map((u) => ({ value: u, label: unitLabels[u] || u }))

  return (
    <FormCalculatorShell title="Speed Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="100" id="spd-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="spd-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="spd-to" />
      </div>
      {valid && <div className="mt-4"><ResultDisplay label={`${value} ${from} =`} value={`${result} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
