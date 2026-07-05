'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

const UNITS: Record<string, number> = {
  'm/s²': 1, g: 9.80665, 'ft/s²': 0.3048, Gal: 0.01,
}

export default function AccelerationConverter() {
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState('m/s²')
  const [to, setTo] = useState('g')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? (v * UNITS[from]) / UNITS[to] : 0
  const options = Object.keys(UNITS).map((u) => ({ value: u, label: u }))
  const pct = valid ? Math.min(Math.abs(result) / Math.max(Math.abs(v), 0.001), 1) : 0

  return (
    <FormCalculatorShell title="Acceleration Converter" subtitle="m/s² · g · ft/s² · gal" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="accel-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="accel-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="accel-to" />
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