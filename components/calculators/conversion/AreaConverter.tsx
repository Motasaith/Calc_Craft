'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { convertUnits } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

const units = ['m²', 'ft²', 'ac', 'ha', 'yd²', 'mi²']
const unitLabels: Record<string, string> = {
  'm²': 'm² (Square Meter)', 'ft²': 'ft² (Square Foot)', ac: 'ac (Acre)',
  ha: 'ha (Hectare)', 'yd²': 'yd² (Square Yard)', 'mi²': 'mi² (Square Mile)',
}

export default function AreaConverter() {
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState('m²')
  const [to, setTo] = useState('ft²')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? convertUnits(v, from, to, 'area') : 0
  const options = units.map((u) => ({ value: u, label: unitLabels[u] || u }))
  const pct = valid ? Math.min(Math.abs(result) / Math.max(Math.abs(v), 0.001), 1) : 0

  return (
    <FormCalculatorShell title="Area Converter" subtitle="Sq meters · acres · hectares · more" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="area-val" />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="area-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="area-to" />
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