'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { convertUnits } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

const units = ['s', 'min', 'h', 'd', 'wk', 'mo', 'yr']
const unitLabels: Record<string, string> = {
  s: 's (Second)', min: 'min (Minute)', h: 'h (Hour)', d: 'd (Day)',
  wk: 'wk (Week)', mo: 'mo (Month)', yr: 'yr (Year)',
}

export default function TimeConverter() {
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState('h')
  const [to, setTo] = useState('min')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? convertUnits(v, from, to, 'time') : 0
  const options = units.map((u) => ({ value: u, label: unitLabels[u] || u }))
  const pct = valid ? Math.min(Math.abs(result) / Math.max(Math.abs(v), 0.001), 1) : 0

  return (
    <FormCalculatorShell title="Time Converter" subtitle="Seconds · minutes · hours · days · more" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="time-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="time-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="time-to" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label={`${value} ${from} =`} value={`${result.toLocaleString('en-US', { maximumFractionDigits: 6 })} ${to}`} large />
          </div>
          <div className="mt-4">
            <svg viewBox="0 0 200 40" className="w-full h-10">
              <path d={wobblyBar(10, 10, 180, 20)} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
              <path d={wobblyBar(10, 10, 180 * pct, 20)} fill="#dfaa44" stroke="#be8b32" strokeWidth="1" />
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}